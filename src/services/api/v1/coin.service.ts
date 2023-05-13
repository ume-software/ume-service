import { PointForUserRequest } from "@/common/requests/adminCreatePointForUser.request";
import { UserCoinResponse } from "@/common/responses/userCoin.response";
import { coinHistoryRepository } from "@/repositories";
import { userService } from "@/services";
import { ICrudOptionPrisma } from "@/services/base/basePrisma.service";
import { CoinHistory, CoinType } from "@prisma/client";

export class CoinService {
  async adminCreatePointToUser(
    adminId: string,
    pointForUserRequest: PointForUserRequest
  ): Promise<UserCoinResponse> {
    const { amount, userId } = pointForUserRequest;
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

    return {
      userId: user?.id!!,
      totalCoin: await this.getTotalCoinUser(userId),
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
    return {
      userId,
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
