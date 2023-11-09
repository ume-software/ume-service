import {
    AdminHandleWithdrawRequest,
    CreateWithdrawRequest,
} from "@/common/requests";
import prisma from "@/models/base.prisma";
import {
    balanceHistoryRepository,
    balanceSettingRepository,
    withdrawRequestRepository,
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
    WithdrawRequestStatus,
    UnitCurrency,
} from "@prisma/client";

export class WithdrawRequestService extends BasePrismaService<
    typeof withdrawRequestRepository
> {
    constructor() {
        super(withdrawRequestRepository);
    }
    async findAndCountAll(query?: ICrudOptionPrisma) {
        return await this.repository.findAndCountAll(query);
    }
    async findOne(query?: ICrudOptionPrisma) {
        return await this.repository.findOne(query);
    }

    async createWithdrawRequest(
        requesterId: string,
        getQrBuyBalanceRequest: CreateWithdrawRequest
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
                ERROR_MESSAGE.YOU_DO_NOT_HAVE_ENOUGH_BALANCE_TO_WITHDRAW
            );
        }
        const { totalMoney } =
            await balanceSettingRepository.convertBalanceToMoneyForWithdraw(
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
            status: WithdrawRequestStatus.PENDING,
        });
    }

    async adminHandleWithdrawRequest(
        adminId: string,
        adminHandleWithdrawRequest: AdminHandleWithdrawRequest
    ) {
        const { id, status, billImageUrl, feedback } =
            adminHandleWithdrawRequest;
        if (!id || !status) {
            throw errorService.badRequest();
        }
        let withdrawRequest = await this.repository.findById(id);
        if (!withdrawRequest) {
            throw errorService.error(ERROR_MESSAGE.DEPOSIT_REQUEST_NOT_FOUND);
        }
        const { PENDING, REJECTED, COMPLETED } = WithdrawRequestStatus;
        if (withdrawRequest.status != PENDING) {
            throw errorService.badRequest();
        }
        if ([COMPLETED, REJECTED].includes(withdrawRequest.status as any)) {
            throw errorService.error(
                ERROR_MESSAGE.DEPOSIT_REQUEST_HAS_BEEN_PROCESSED
            );
        }

        return await prisma.$transaction(async (tx) => {
            const body: Prisma.WithdrawRequestUpdateInput = {
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
                                id: withdrawRequest?.requesterId!,
                            },
                        },
                        amount: -withdrawRequest?.amountBalance!,
                        balanceType: BalanceType.WITHDRAW,
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
            withdrawRequest = await this.repository.updateById(id, body, tx);
            return withdrawRequest;
        });
    }
    async userCancelBalanceRequest(userCancelBalanceRequest: {
        userId: string;
        id: string;
    }) {
        const { id, userId } = userCancelBalanceRequest;
        if (!id || !userId) {
            throw errorService.badRequest();
        }

        let withdrawRequest = await this.repository.findOne({
            where: {
                id,
                requesterId: userId,
            },
        });
        if (!withdrawRequest) {
            throw errorService.error(ERROR_MESSAGE.DEPOSIT_REQUEST_NOT_FOUND);
        }

        return await this.repository.updateById(id, {
            status: WithdrawRequestStatus.CANCEL,
        });
    }
}
