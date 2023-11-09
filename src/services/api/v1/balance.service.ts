import { BalanceForUserRequest } from "@/common/requests/balance/adminCreateBalanceForUser.request";
import { UserBalanceResponse } from "@/common/responses/balance/userBalance.response";
import {
    bookingHistoryRepository,
    balanceHistoryRepository,
    withdrawRequestRepository,
} from "@/repositories";
import { errorService, userService } from "@/services";
import { ICrudOptionPrisma } from "@/services/base/basePrisma.service";
import { ERROR_MESSAGE } from "@/services/errors/errorMessage";
import { BalanceHistory, BalanceType } from "@prisma/client";

export class BalanceService {
    async findAndCountAll(query?: ICrudOptionPrisma) {
        return await balanceHistoryRepository.findAndCountAll(query);
    }
    async adminCreateBalanceToUser(
        adminId: string,
        balanceForUserRequest: BalanceForUserRequest
    ): Promise<UserBalanceResponse> {
        const { amount, userId } = balanceForUserRequest;
        const user = await userService.findOne({
            where: {
                id: userId,
            },
        });
        await balanceHistoryRepository.create({
            user: {
                connect: {
                    id: userId,
                },
            },
            amount,
            balanceType: BalanceType.ADMIN,
            adminCreated: {
                connect: {
                    id: adminId,
                },
            },
        });
        const { totalBalanceAvailable, totalBalance } =
            await this.getTotalBalanceByUserSlug(userId);

        return {
            userId: user?.id!!,
            totalBalanceAvailable,
            totalBalance,
        };
    }

    async getHistoryBalanceByUserId(
        userId: string,
        queryBalanceHistory: ICrudOptionPrisma
    ): Promise<{
        row: BalanceHistory[];
        count: number;
    }> {
        if (!queryBalanceHistory.where) queryBalanceHistory.where = {};
        queryBalanceHistory.where.userId = userId;
        return await balanceHistoryRepository.findAndCountAll(
            queryBalanceHistory
        );
    }

    async getTotalBalanceByUserSlug(
        slug: string
    ): Promise<UserBalanceResponse> {
        const user = await userService.findOne({
            where: {
                OR: [
                    {
                        id: slug,
                    },
                    {
                        slug: slug,
                    },
                ],
            },
        });
        if (!user) {
            throw errorService.error(ERROR_MESSAGE.USER_NOT_FOUND);
        }
        const totalBalance = await this.getTotalBalanceUser(user.id);
        const getTotalBalanceFrozenFromBooking =
            await bookingHistoryRepository.getTotalBalanceFrozenByBookerId(
                user.id
            );
        const getTotalBalanceFrozenFromWithdraw =
            await withdrawRequestRepository.getTotalBalanceFrozenByRequesterId(
                user.id
            );
        return {
            userId: user.id,
            totalBalanceAvailable:
                totalBalance -
                getTotalBalanceFrozenFromBooking -
                getTotalBalanceFrozenFromWithdraw,
            totalBalance,
        };
    }
    async getTotalBalanceByProviderSlug(
        slug: string
    ): Promise<UserBalanceResponse> {
        const user = await userService.findOne({
            where: {
                provider: {
                    OR: [
                        {
                            id: slug,
                        },
                        {
                            slug: slug,
                        },
                    ],
                },
            },
        });
        if (!user) {
            throw errorService.error(ERROR_MESSAGE.USER_NOT_FOUND);
        }
        const totalBalance = await this.getTotalBalanceUser(user.id);
        const getTotalBalanceFrozen =
            await bookingHistoryRepository.getTotalBalanceFrozenByBookerId(
                user.id
            );
        return {
            userId: user.id,
            totalBalanceAvailable: totalBalance - getTotalBalanceFrozen,
            totalBalance,
        };
    }
    private async getTotalBalanceUser(userId: string) {
        return (
            (await balanceHistoryRepository.countByUserIdAndBalanceType(
                userId,
                Object.values(BalanceType)
            )) || 0
        );
    }
}
