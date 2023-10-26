import { CoinForUserRequest } from "@/common/requests/coin/adminCreateCoinForUser.request";
import { UserCoinResponse } from "@/common/responses/coin/userCoin.response";
import {
    bookingHistoryRepository,
    coinHistoryRepository,
    withdrawRequestRepository,
} from "@/repositories";
import { errorService, userService } from "@/services";
import { ICrudOptionPrisma } from "@/services/base/basePrisma.service";
import { ERROR_MESSAGE } from "@/services/errors/errorMessage";
import { CoinHistory, CoinType } from "@prisma/client";

export class CoinService {
    async findAndCountAll(query?: ICrudOptionPrisma) {
        return await coinHistoryRepository.findAndCountAll(query);
    }
    async adminCreatePointToUser(
        adminId: string,
        coinForUserRequest: CoinForUserRequest
    ): Promise<UserCoinResponse> {
        const { amount, userId } = coinForUserRequest;
        const user = await userService.findOne({
            where: {
                id: userId,
            },
        });
        await coinHistoryRepository.create({
            user: {
                connect: {
                    id: userId,
                },
            },
            amount,
            coinType: CoinType.ADMIN,
            adminCreated: {
                connect: {
                    id: adminId,
                },
            },
        });
        const { totalCoinsAvailable, totalCoin } =
            await this.getTotalCoinByUserSlug(userId);

        return {
            userId: user?.id!!,
            totalCoinsAvailable,
            totalCoin,
        };
    }

    async getHistoryCoinByUserId(
        userId: string,
        queryCoinHistory: ICrudOptionPrisma
    ): Promise<{
        row: CoinHistory[];
        count: number;
    }> {
        if (!queryCoinHistory.where) queryCoinHistory.where = {};
        queryCoinHistory.where.userId = userId;
        return await coinHistoryRepository.findAndCountAll(queryCoinHistory);
    }

    async getTotalCoinByUserSlug(slug: string): Promise<UserCoinResponse> {
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
        const totalCoin = await this.getTotalCoinUser(user.id);
        const getTotalCoinFrozenFromBooking =
            await bookingHistoryRepository.getTotalCoinFrozenByBookerId(
                user.id
            );
        const getTotalCoinFrozenFromWithdraw =
            await withdrawRequestRepository.getTotalCoinFrozenByRequesterId(
                user.id
            );
        return {
            userId: user.id,
            totalCoinsAvailable:
                totalCoin -
                getTotalCoinFrozenFromBooking -
                getTotalCoinFrozenFromWithdraw,
            totalCoin,
        };
    }
    async getTotalCoinByProviderSlug(slug: string): Promise<UserCoinResponse> {
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
        const totalCoin = await this.getTotalCoinUser(user.id);
        const getTotalCoinFrozen =
            await bookingHistoryRepository.getTotalCoinFrozenByBookerId(
                user.id
            );
        return {
            userId: user.id,
            totalCoinsAvailable: totalCoin - getTotalCoinFrozen,
            totalCoin,
        };
    }
    private async getTotalCoinUser(userId: string) {
        return (
            (await coinHistoryRepository.countByUserIdAndCoinType(
                userId,
                Object.values(CoinType)
            )) || 0
        );
    }
}
