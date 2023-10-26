import {
    AdminHandleWithdrawRequest,
    CreateWithdrawRequest,
} from "@/common/requests";
import prisma from "@/models/base.prisma";
import {
    coinHistoryRepository,
    coinSettingRepository,
    withdrawRequestRepository,
} from "@/repositories";
import { coinService, errorService } from "@/services";

import {
    BasePrismaService,
    ICrudOptionPrisma,
} from "@/services/base/basePrisma.service";
import { ERROR_MESSAGE } from "@/services/errors/errorMessage";
import {
    CoinType,
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

    async createSellCoin(
        requesterId: string,
        getQrBuyCoinRequest: CreateWithdrawRequest
    ) {
        const { amountCoin, userPaymentSystemId, unitCurrency } =
            getQrBuyCoinRequest;
        if (!amountCoin || !unitCurrency || !userPaymentSystemId) {
            throw errorService.badRequest();
        }
        const checkAmountCoin = await coinService.getTotalCoinByUserSlug(
            requesterId
        );
        if (checkAmountCoin.totalCoinsAvailable < amountCoin) {
            throw errorService.error(
                ERROR_MESSAGE.YOU_DO_NOT_HAVE_ENOUGH_COINS_TO_WITHDRAW
            );
        }
        const { totalMoney } =
            await coinSettingRepository.convertCoinToMoneyForSellCoin(
                amountCoin,
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
            amountCoin,
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
            throw errorService.error(ERROR_MESSAGE.BUY_COIN_REQUEST_NOT_FOUND);
        }
        if (withdrawRequest.handlerId != adminId) {
            throw errorService.permissionDeny();
        }
        const { PENDING, REJECTED, COMPLETED } = WithdrawRequestStatus;
        if (withdrawRequest.status != PENDING) {
            throw errorService.badRequest();
        }
        if ([COMPLETED, REJECTED].includes(withdrawRequest.status as any)) {
            throw errorService.error(
                ERROR_MESSAGE.BUY_COIN_REQUEST_HAS_BEEN_PROCESSED
            );
        }

        return await prisma.$transaction(async (tx) => {
            const body: Prisma.WithdrawRequestUpdateInput = {
                billImageUrl: billImageUrl!,
                handlerFeedback: feedback!,
                status,
            };

            if (status == COMPLETED) {
                const coinHistory = await coinHistoryRepository.create(
                    {
                        user: {
                            connect: {
                                id: withdrawRequest?.requesterId!,
                            },
                        },
                        amount: -withdrawRequest?.amountCoin!,
                        coinType: CoinType.WITHDRAW,
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
            withdrawRequest = await this.repository.updateById(id, body, tx);
            return withdrawRequest;
        });
    }
    async userCancelCoinRequest(userCancelCoinRequest: {
        userId: string;
        id: string;
    }) {
        const { id, userId } = userCancelCoinRequest;
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
            throw errorService.error(ERROR_MESSAGE.BUY_COIN_REQUEST_NOT_FOUND);
        }

        return await this.repository.updateById(id, {
            status: WithdrawRequestStatus.CANCEL,
        });
    }
}
