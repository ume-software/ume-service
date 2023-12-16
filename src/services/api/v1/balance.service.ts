import { BalanceForUserRequest } from "@/common/requests/balance/adminCreateBalanceForUser.request";
import { UserBalanceResponse } from "@/common/responses/balance/userBalance.response";
import { EIntervalUnit } from "@/enums/intervalUnit.enum";
import {
    bookingHistoryRepository,
    balanceHistoryRepository,
    withdrawalRequestRepository,
    userRepository,
} from "@/repositories";
import { errorService } from "@/services";
import {
    BasePrismaService,
    ICrudOptionPrisma,
} from "@/services/base/basePrisma.service";
import { ERROR_MESSAGE } from "@/services/errors/errorMessage";
import { BalanceHistory, BalanceType } from "@prisma/client";

export class BalanceService extends BasePrismaService<
    typeof balanceHistoryRepository
> {
    constructor() {
        super(balanceHistoryRepository);
    }
    async findAndCountAll(query?: ICrudOptionPrisma) {
        return await this.repository.findAndCountAll(query);
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
        await this.repository.create({
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
        return await this.repository.findAndCountAll(queryBalanceHistory);
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
        const totalBalance = await this.repository.getTotalBalanceUser(user.id);
        const getTotalBalanceFrozenFromBooking =
            await bookingHistoryRepository.getTotalBalanceFrozenByBookerId(
                user.id
            );
        const getTotalBalanceFrozenFromWithdrawal =
            await withdrawalRequestRepository.getTotalBalanceFrozenByRequesterId(
                user.id
            );
        const getTotalBalanceFrozenBooking =
            await withdrawalRequestRepository.getTotalBalanceFrozenBooking(
                user.id
            );

        return {
            userId: user.id,
            totalBalanceAvailable:
                totalBalance -
                getTotalBalanceFrozenFromBooking -
                getTotalBalanceFrozenFromWithdrawal -
                getTotalBalanceFrozenBooking,
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

        return this.repository.getTotalBalanceByUserId(user.id);
    }

    async balanceFluctuationByUserIdStatistics(
        userId: string,
        time?: number,
        unit?: EIntervalUnit,
        gapUnit?: EIntervalUnit
    ) {
        return await this.repository.balanceFluctuationByUserIdStatistics(
            userId,
            time,
            unit,
            gapUnit
        );
    }
}
