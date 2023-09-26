import {
    BuyCoinCalculateRequest,
    BuyCoinCalculateListRequest,
    CreateBuyCoinRequest,
    BuyCoinHandleRequest,
} from "@/common/requests";
import {
    BuyCoinCalculateResponse,
    BuyCoinCalculateListResponse,
} from "@/common/responses";
import prisma from "@/models/base.prisma";
import {
    coinSettingRepository,
    buyCoinRequestRepository,
    coinHistoryRepository,
} from "@/repositories";
import {
    errorService,
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
    BuyCoinRequestDataStringType,
    BuyCoinRequestStatus,
    CoinType,
    PaymentSystemPlatform,
    Prisma,
    UnitCurrency,
} from "@prisma/client";

export class BuyCoinRequestService extends BasePrismaService<
    typeof buyCoinRequestRepository
> {
    constructor() {
        super(buyCoinRequestRepository);
    }
    async findAndCountAll(query?: ICrudOptionPrisma) {
        return await this.repository.findAndCountAll(query);
    }

    async buyCoinCalculate(
        buyCoinCalculateRequest: BuyCoinCalculateRequest
    ): Promise<BuyCoinCalculateResponse> {
        const { amountCoin, platform, unitCurrency } = buyCoinCalculateRequest;
        if (!amountCoin || !platform || !unitCurrency) {
            throw errorService.badRequest();
        }
        const result = await coinSettingRepository.convertCoinToMoneyForBuyCoin(
            amountCoin,
            unitCurrency,
            platform
        );

        return {
            ...buyCoinCalculateRequest,
            ...result,
        };
    }
    async buyCoinCalculateList(
        buyCoinCalculateListRequest: BuyCoinCalculateListRequest
    ): Promise<BuyCoinCalculateListResponse> {
        const { amountCoins, platform, unitCurrency } =
            buyCoinCalculateListRequest;
        if (!amountCoins || !platform || !unitCurrency) {
            throw errorService.badRequest();
        }
        const option =
            await coinSettingRepository.getConvertCoinToMoneyForBuyCoinRate(
                unitCurrency,
                platform
            );
        const row = amountCoins.map((amountCoin: number) => {
            return {
                amountCoin,
                platform,
                unitCurrency,
                ...coinSettingRepository.calculateCoinToMoneyForBuyCoin(
                    amountCoin,
                    option
                ),
            };
        });

        return {
            row,
        };
    }

    async createBuyCoin(
        requesterId: string,
        getQrBuyCoinRequest: CreateBuyCoinRequest
    ) {
        const { amountCoin, platform, unitCurrency } = getQrBuyCoinRequest;
        if (!amountCoin || !platform || !unitCurrency) {
            throw errorService.badRequest();
        }
        const { totalMoney } =
            await coinSettingRepository.convertCoinToMoneyForBuyCoin(
                amountCoin,
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
                            amountCoin,
                            dataString: vnpayService.createPaymentUrl({
                                amount: totalMoney,
                                orderId: transferContent,
                                bankCode: "",
                                locale: "vn",
                            }),
                            dataStringType:
                                BuyCoinRequestDataStringType.REDIRECT_URL,
                            transactionCode,
                            platform,
                            status: BuyCoinRequestStatus.INIT,
                            content: transferContent,
                        },
                        tx
                    );
                    break;
                }
                default: {
                    const { qrString, adminPaymentSystem } =
                        await qrPaymentService.getQrBuyCoin({
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
                            amountCoin,
                            dataString: qrString,
                            dataStringType: BuyCoinRequestDataStringType.QR,
                            transactionCode,
                            platform,
                            handler: {
                                connect: {
                                    id: adminPaymentSystem.adminId,
                                },
                            },
                            beneficiary: adminPaymentSystem.beneficiary,
                            status: BuyCoinRequestStatus.INIT,
                            content: transferContent,
                        },
                        tx
                    );
                }
            }
        });
    }

    async buyCoinHandle(
        adminId: string,
        buyCoinHandleRequest: BuyCoinHandleRequest
    ) {
        const { id, status, billImageUrl, feedback } = buyCoinHandleRequest;
        if (!id || !status) {
            throw errorService.badRequest();
        }

        let buyCoinRequest = await this.repository.findById(id);
        if (!buyCoinRequest) {
            throw errorService.error(ERROR_MESSAGE.BUY_COIN_REQUEST_NOT_FOUND);
        }
        if (buyCoinRequest.handlerId != adminId) {
            throw errorService.permissionDeny();
        }
        const { APPROVED, INIT, PENDING, REJECTED, USER_NOTICES_PAID } =
            BuyCoinRequestStatus;
        if (
            ![USER_NOTICES_PAID, INIT, PENDING].includes(
                buyCoinRequest.status as any
            ) ||
            [INIT, USER_NOTICES_PAID].includes(status as any)
        ) {
            throw errorService.badRequest();
        }
        if ([APPROVED, REJECTED].includes(buyCoinRequest.status as any)) {
            throw errorService.error(
                ERROR_MESSAGE.BUY_COIN_REQUEST_HAS_BEEN_PROCESSED
            );
        }

        return await prisma.$transaction(async (tx) => {
            const body: Prisma.BuyCoinRequestUpdateInput = {
                billImageUrl: billImageUrl!,
                handlerFeedback: feedback!,
                status,
            };

            if (status == APPROVED) {
                const coinHistory = await coinHistoryRepository.create(
                    {
                        user: {
                            connect: {
                                id: buyCoinRequest?.requesterId!,
                            },
                        },
                        amount: buyCoinRequest?.amountCoin!,
                        coinType: CoinType.BUY_COIN,
                        adminCreated: {
                            connect: {
                                id: adminId,
                            },
                        },
                    },
                    tx
                );
                body.coinHistory = {
                    connect: {
                        id: coinHistory.id,
                    },
                };
            }
            buyCoinRequest = await this.repository.updateById(id, body, tx);
            return buyCoinRequest;
        });
    }
}
