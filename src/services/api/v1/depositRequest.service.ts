import {
    DepositCalculateRequest,
    DepositCalculateListRequest,
    CreateDepositRequest,
    DepositHandleRequest,
} from "@/common/requests";
import {
    DepositCalculateResponse,
    DepositCalculateListResponse,
} from "@/common/responses";
import prisma from "@/models/base.prisma";
import {
    balanceSettingRepository,
    depositRequestRepository,
    balanceHistoryRepository,
    noticeRepository,
} from "@/repositories";
import {
    errorService,
    momoService,
    qrPaymentService,
    utilService,
    vnpayService,
} from "@/services";
import {
    BasePrismaService,
    ICrudOptionPrisma,
} from "@/services/base/basePrisma.service";
import { ERROR_MESSAGE } from "@/services/errors/errorMessage";
import {
    DepositRequestDataStringType,
    DepositRequestStatus,
    BalanceType,
    PaymentSystemPlatform,
    Prisma,
    UnitCurrency,
    NoticeType,
} from "@prisma/client";

export class DepositRequestService extends BasePrismaService<
    typeof depositRequestRepository
> {
    constructor() {
        super(depositRequestRepository);
    }
    async findAndCountAll(query?: ICrudOptionPrisma) {
        return await this.repository.findAndCountAll(query);
    }
    async findOne(query?: ICrudOptionPrisma) {
        return await this.repository.findOne(query);
    }

    async depositCalculate(
        depositCalculateRequest: DepositCalculateRequest
    ): Promise<DepositCalculateResponse> {
        const { amountBalance, platform, unitCurrency } =
            depositCalculateRequest;
        if (!amountBalance || !platform || !unitCurrency) {
            throw errorService.badRequest();
        }
        const result =
            await balanceSettingRepository.convertBalanceToMoneyForDeposit(
                amountBalance,
                unitCurrency,
                platform
            );

        return {
            ...depositCalculateRequest,
            ...result,
        };
    }
    async depositCalculateList(
        depositCalculateListRequest: DepositCalculateListRequest
    ): Promise<DepositCalculateListResponse> {
        const { amountBalance, platform, unitCurrency } =
            depositCalculateListRequest;
        if (!amountBalance || !platform || !unitCurrency) {
            throw errorService.badRequest();
        }
        const option =
            await balanceSettingRepository.getConvertBalanceToMoneyForDepositRate(
                unitCurrency,
                platform
            );
        const row = amountBalance.map((amountBalance: number) => {
            return {
                amountBalance,
                platform,
                unitCurrency,
                ...balanceSettingRepository.calculateBalanceToMoneyForDeposit(
                    amountBalance,
                    option
                ),
            };
        });

        return {
            row,
        };
    }

    async createDeposit(
        requesterId: string,
        getQrDepositRequest: CreateDepositRequest
    ) {
        const { amountBalance, platform, unitCurrency } = getQrDepositRequest;
        if (!amountBalance || !platform || !unitCurrency) {
            throw errorService.badRequest();
        }
        const { totalMoney } =
            await balanceSettingRepository.convertBalanceToMoneyForDeposit(
                amountBalance,
                unitCurrency,
                platform
            );

        return await prisma.$transaction(async (tx) => {
            let transactionCode = "";
            do {
                transactionCode = utilService.generateTransactionCode();
                if (
                    await this.repository.findOne({
                        where: {
                            transactionCode,
                        },
                    })
                ) {
                    transactionCode = "";
                }
            } while (!transactionCode);

            const transferContent = `${transactionCode}`;

            switch (platform) {
                case PaymentSystemPlatform.VNPAY: {
                    return await this.repository.create(
                        {
                            requester: {
                                connect: {
                                    id: requesterId,
                                },
                            },
                            unitCurrency: UnitCurrency.VND,
                            amountMoney: totalMoney,
                            amountBalance,
                            dataString: vnpayService.createPaymentUrl({
                                amount: totalMoney,
                                orderId: transferContent,
                                bankCode: "",
                                locale: "vn",
                            }),
                            dataStringType:
                                DepositRequestDataStringType.REDIRECT_URL,
                            transactionCode,
                            platform,
                            status: DepositRequestStatus.INIT,
                            content: transferContent,
                        },
                        tx
                    );
                    break;
                }
                case PaymentSystemPlatform.MOMO: {
                    return await this.repository.create(
                        {
                            requester: {
                                connect: {
                                    id: requesterId,
                                },
                            },
                            unitCurrency: UnitCurrency.VND,
                            amountMoney: totalMoney,
                            amountBalance,
                            dataString: await momoService.createPaymentUrl({
                                amount: totalMoney,
                                orderId: transferContent,
                            }),
                            dataStringType:
                                DepositRequestDataStringType.REDIRECT_URL,
                            transactionCode,
                            platform,
                            status: DepositRequestStatus.INIT,
                            content: transferContent,
                        },
                        tx
                    );
                    break;
                }
                default: {
                    const { qrString, adminPaymentSystem } =
                        await qrPaymentService.getQrDeposit({
                            amount: totalMoney,
                            platform,
                            transferContent,
                        });

                    return await this.repository.create(
                        {
                            requester: {
                                connect: {
                                    id: requesterId,
                                },
                            },
                            unitCurrency: UnitCurrency.VND,
                            amountMoney: totalMoney,
                            amountBalance,
                            dataString: qrString,
                            dataStringType: DepositRequestDataStringType.QR,
                            transactionCode,
                            platform,
                            handler: {
                                connect: {
                                    id: adminPaymentSystem.adminId,
                                },
                            },
                            beneficiary: adminPaymentSystem.beneficiary,
                            status: DepositRequestStatus.INIT,
                            content: transferContent,
                        },
                        tx
                    );
                }
            }
        });
    }

    async depositHandle(
        adminId: string,
        depositHandleRequest: DepositHandleRequest
    ) {
        const { id, status, billImageUrl, feedback } = depositHandleRequest;
        if (!id || !status) {
            throw errorService.badRequest();
        }

        let depositRequest = await this.repository.findById(id);
        if (!depositRequest) {
            throw errorService.error(ERROR_MESSAGE.DEPOSIT_REQUEST_NOT_FOUND);
        }
        if (depositRequest.handlerId != adminId) {
            throw errorService.permissionDeny();
        }
        const { APPROVED, INIT, PENDING, REJECTED, USER_NOTICES_PAID } =
            DepositRequestStatus;
        if (
            ![USER_NOTICES_PAID, INIT, PENDING].includes(
                depositRequest.status as any
            ) ||
            [INIT, USER_NOTICES_PAID].includes(status as any)
        ) {
            throw errorService.badRequest();
        }
        if ([APPROVED, REJECTED].includes(depositRequest.status as any)) {
            throw errorService.error(
                ERROR_MESSAGE.DEPOSIT_REQUEST_HAS_BEEN_PROCESSED
            );
        }

        return await prisma.$transaction(async (tx) => {
            const body: Prisma.DepositRequestUpdateInput = {
                billImageUrl: billImageUrl!,
                handlerFeedback: feedback!,
                status,
            };

            if (status == APPROVED) {
                const balanceHistory = await balanceHistoryRepository.create(
                    {
                        user: {
                            connect: {
                                id: depositRequest?.requesterId!,
                            },
                        },
                        amount: depositRequest?.amountBalance!,
                        balanceType: BalanceType.DEPOSIT,
                        adminCreated: {
                            connect: {
                                id: adminId,
                            },
                        },
                    },
                    tx
                );
                body.balanceHistory = {
                    connect: {
                        id: balanceHistory.id,
                    },
                };
            }
            depositRequest = await this.repository.updateById(id, body, tx);
            if (status == APPROVED)
                noticeRepository.create({
                    user: {
                        connect: {
                            id: depositRequest?.requesterId!,
                        },
                    },
                    type: NoticeType.DEPOSIT_REQUEST_SUCCESS,
                    data: JSON.parse(JSON.stringify(depositRequest)),
                });
            return depositRequest;
        });
    }
}
