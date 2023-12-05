import {
    AdminHandleWithdrawalRequest,
    CreateWithdrawalRequest,
} from "@/common/requests";
import prisma from "@/models/base.prisma";
import {
    balanceHistoryRepository,
    balanceSettingRepository,
    noticeRepository,
    withdrawalRequestRepository,
} from "@/repositories";
import { balanceService, errorService } from "@/services";

import {
    BasePrismaService,
    ICrudOptionPrisma,
} from "@/services/base/basePrisma.service";
import { ERROR_MESSAGE } from "@/services/errors/errorMessage";
import {
    BalanceType,
    Prisma,
    WithdrawalRequestStatus,
    UnitCurrency,
    NoticeType,
} from "@prisma/client";

export class WithdrawalRequestService extends BasePrismaService<
    typeof withdrawalRequestRepository
> {
    constructor() {
        super(withdrawalRequestRepository);
    }
    async findAndCountAll(query?: ICrudOptionPrisma) {
        return await this.repository.findAndCountAll(query);
    }
    async findOne(query?: ICrudOptionPrisma) {
        return await this.repository.findOne(query);
    }

    async createWithdrawalRequest(
        requesterId: string,
        getQrBuyBalanceRequest: CreateWithdrawalRequest
    ) {
        const { amountBalance, userPaymentSystemId, unitCurrency } =
            getQrBuyBalanceRequest;
        if (!amountBalance || !unitCurrency || !userPaymentSystemId) {
            throw errorService.badRequest();
        }
        const checkAmountBalance =
            await balanceService.getTotalBalanceByUserSlug(requesterId);
        if (checkAmountBalance.totalBalanceAvailable < amountBalance) {
            throw errorService.error(
                ERROR_MESSAGE.YOU_DO_NOT_HAVE_ENOUGH_BALANCE_TO_WITHDRAWAL
            );
        }
        const { totalMoney } =
            await balanceSettingRepository.convertBalanceToMoneyForWithdrawal(
                amountBalance,
                unitCurrency
            );

        return await this.repository.create({
            requester: {
                connect: {
                    id: requesterId,
                },
            },
            unitCurrency: UnitCurrency.VND,
            amountMoney: totalMoney,
            amountBalance,
            userPaymentSystem: {
                connect: {
                    id: userPaymentSystemId,
                },
            },
            status: WithdrawalRequestStatus.PENDING,
        });
    }

    async adminHandleWithdrawalRequest(
        adminId: string,
        adminHandleWithdrawalRequest: AdminHandleWithdrawalRequest
    ) {
        const { id, status, billImageUrl, feedback } =
            adminHandleWithdrawalRequest;
        if (!id || !status) {
            throw errorService.badRequest();
        }
        let withdrawalRequest = await this.repository.findById(id);
        if (!withdrawalRequest) {
            throw errorService.error(ERROR_MESSAGE.DEPOSIT_REQUEST_NOT_FOUND);
        }
        const { PENDING, REJECTED, COMPLETED } = WithdrawalRequestStatus;
        if (withdrawalRequest.status != PENDING) {
            throw errorService.badRequest();
        }
        if ([COMPLETED, REJECTED].includes(withdrawalRequest.status as any)) {
            throw errorService.error(
                ERROR_MESSAGE.DEPOSIT_REQUEST_HAS_BEEN_PROCESSED
            );
        }

        return await prisma.$transaction(async (tx) => {
            const body: Prisma.WithdrawalRequestUpdateInput = {
                billImageUrl: billImageUrl!,
                handlerFeedback: feedback!,
                status,
                handlerId: adminId,
            };

            if (status == COMPLETED) {
                const balanceHistory = await balanceHistoryRepository.create(
                    {
                        user: {
                            connect: {
                                id: withdrawalRequest?.requesterId!,
                            },
                        },
                        amount: -withdrawalRequest?.amountBalance!,
                        balanceType: BalanceType.WITHDRAWAL,
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
            withdrawalRequest = await this.repository.updateById(id, body, tx);

            await noticeRepository.create(
                {
                    user: {
                        connect: {
                            id: withdrawalRequest?.requesterId!,
                        },
                    },
                    type:
                        status == COMPLETED
                            ? NoticeType.ADMIN_HAS_COMPLETED_WITHDRAWAL_REQUEST
                            : NoticeType.ADMIN_HAS_REJECTED_WITHDRAWAL_REQUEST,
                    data: JSON.parse(JSON.stringify(withdrawalRequest)),
                },
                tx
            );
            return withdrawalRequest;
        });
    }
    async userCancelWithdrawalRequest(userCancelWithdrawalRequest: {
        userId: string;
        id: string;
    }) {
        const { id, userId } = userCancelWithdrawalRequest;
        if (!id || !userId) {
            throw errorService.badRequest();
        }

        let withdrawalRequest = await this.repository.findOne({
            where: {
                id,
                requesterId: userId,
            },
        });
        if (!withdrawalRequest) {
            throw errorService.error(ERROR_MESSAGE.DEPOSIT_REQUEST_NOT_FOUND);
        }

        return await this.repository.updateById(id, {
            status: WithdrawalRequestStatus.CANCEL,
        });
    }
}
