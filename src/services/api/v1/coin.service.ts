import { PointForUserRequest } from "@/common/requests/adminCreatePointForUser.request";
import { UserCoinResponse } from "@/common/responses/userCoin.response";
import { UserInfomationResponse } from "@/common/responses/userInfomation.reponse";
import { coinHistoryRepository } from "@/repositories";
import { userService } from "@/services";
import { CoinType } from "@prisma/client";

export class CoinService {
  async adminCreatePointToUser(
    adminId: string,
    pointForUserRequest: PointForUserRequest
  ): Promise<UserCoinResponse> {
    const { amount, userId } = pointForUserRequest;
    await userService.findOne({
      where: {
        id: userId,
      },
    });
    const { avatar, dob, gender, name, phone, email, username } =
      (await userService.getInfomation(userId)) as UserInfomationResponse;

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
      userInfomation: {
        avatar,
        dob,
        gender,
        name,
        phone,
        email,
        username,
      },
      totalCoin: await this.getTotalCoinUser(userId),
    };
  }

  async getTotalCoinUser(userId: string) {
    return (
      (await coinHistoryRepository.countByUserIdAndCoinType(
        userId,
        Object.values(CoinType)
      )) || 0
    );
  }
}
