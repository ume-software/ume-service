import { CoinForUserRequest } from "@/common/requests/coin/adminCreateCoinForUser.request";
import { UserCoinResponse } from "@/common/responses/coin/userCoin.response";
import {
    bookingHistoryRepository,
    coinHistoryRepository,
} from "@/repositories";
import { userService } from "@/services";
import { ICrudOptionPrisma } from "@/services/base/basePrisma.service";
import { CoinHistory, CoinType } from "@prisma/client";

export class CoinService {
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
            createdId: adminId,
        });
        const { totalCoinsAvailable, totalCoin } =
            await this.getTotalCoinByUserId(userId);

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
        if (!queryCoinHistory.where) {
            queryCoinHistory.where = { userId };
        } else {
            queryCoinHistory.where.userId = userId;
        }
        return await coinHistoryRepository.findAndCountAll(queryCoinHistory);
    }

    async getTotalCoinByUserId(userId: string): Promise<UserCoinResponse> {
        const user = await userService.findOne({
            where: {
                id: userId,
            },
        });
        const totalCoin = await this.getTotalCoinUser(user?.id!!);
        const getTotalCoinFrozen =
            await bookingHistoryRepository.getTotalCoinFrozenByBookerId(userId);
        return {
            userId,
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
