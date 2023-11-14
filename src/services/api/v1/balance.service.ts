import { BalanceForUserRequest } from "@/common/requests/balance/adminCreateBalanceForUser.request";
import { UserBalanceResponse } from "@/common/responses/balance/userBalance.response";
import {
    bookingHistoryRepository,
    balanceHistoryRepository,
    withdrawalRequestRepository,
    userRepository,
} from "@/repositories";
import { errorService } from "@/services";
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
        const user = await userRepository.findOne({
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
        const user = await userRepository.findOne({
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
        const totalBalance = await balanceHistoryRepository.getTotalBalanceUser(
            user.id
        );
        const getTotalBalanceFrozenFromBooking =
            await bookingHistoryRepository.getTotalBalanceFrozenByBookerId(
                user.id
            );
        const getTotalBalanceFrozenFromWithdrawal =
            await withdrawalRequestRepository.getTotalBalanceFrozenByRequesterId(
                user.id
            );
        return {
            userId: user.id,
            totalBalanceAvailable:
                totalBalance -
                getTotalBalanceFrozenFromBooking -
                getTotalBalanceFrozenFromWithdrawal,
            totalBalance,
        };
    }
    async getTotalBalanceByProviderSlug(
        slug: string
    ): Promise<UserBalanceResponse> {
        const user = await userRepository.findOne({
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

        return balanceHistoryRepository.getTotalBalanceByUserId(user.id);
    }
}
