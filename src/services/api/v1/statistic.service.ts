import { EIntervalUnit } from "@/enums/intervalUnit.enum";
import {
    bookingHistoryRepository,
    depositRequestRepository,
    providerConfigRepository,
    providerServiceRepository,
    userRepository,
    withdrawalRequestRepository,
} from "@/repositories";
import { DepositRequestStatus, WithdrawalRequestStatus } from "@prisma/client";

export class StatisticService {
    async newUserStatistics(
        time?: number,
        unit?: EIntervalUnit,
        gapUnit?: EIntervalUnit
    ) {
        return await userRepository.newUserStatistics(time, unit, gapUnit);
    }

    async newProviderStatistics(
        time?: number,
        unit?: EIntervalUnit,
        gapUnit?: EIntervalUnit
    ) {
        return await providerConfigRepository.newProviderStatistics(
            time,
            unit,
            gapUnit
        );
    }

    async getTotalUser() {
        const totalUser = await userRepository.count();
        const totalUserIsBanned = await userRepository.count({
            where: {
                isBanned: true,
            },
        });
       
        const totalUserIsVerified = await userRepository.count({
            where: {
                isVerified: true,
            },
        });

        const totalUserIsBannedAndIsVerified = await userRepository.count({
            where: {
                isBanned: true,
                isVerified: true,
            },
        });
        const totalUserIsBannedAndIsNotVerified = await userRepository.count({
            where: {
                isBanned: true,
                isVerified: false,
            },
        });

        const totalUserIsNotBannedAndIsVerified = await userRepository.count({
            where: {
                isBanned: false,
                isVerified: true,
            },
        });
        const totalUserIsNotBannedAndIsNotVerified = await userRepository.count({
            where: {
                isBanned: false,
                isVerified: false,
            },
        });
        return {
            totalUser,
            totalUserIsVerified,
            totalUserIsBanned,
            totalUserIsBannedAndIsVerified,
            totalUserIsBannedAndIsNotVerified,
            totalUserIsNotBannedAndIsVerified,
            totalUserIsNotBannedAndIsNotVerified
        };
    }

    async getTotalProvider() {
        const totalProvider = await providerConfigRepository.count();
        const totalProviderIsBanned = await providerConfigRepository.count({
            where: {
                isBanned: true,
            },
        });
        return { totalProvider, totalProviderIsBanned };
    }

    async getMostProviderServicesStatistics(limit: number) {
        return await providerServiceRepository.getMostProviderServicesStatistics(
            limit
        );
    }
    async getMostBookingServicesStatistics(limit: number) {
        return await bookingHistoryRepository.getMostBookingServicesStatistics(
            limit
        );
    }
    async adminGetTotalDepositWithdrawal() {
        const totalDeposit = await depositRequestRepository.getTotalAmountMoney(
            {
                status: DepositRequestStatus.APPROVED,
            }
        );
        const totalWithdrawal =
            await withdrawalRequestRepository.getTotalAmountMoney({
                status: WithdrawalRequestStatus.COMPLETED,
            });

        return {
            totalDeposit,
            totalWithdrawal,
        };
    }

    async amountMoneyDepositStatistics(
        time?: number,
        unit?: EIntervalUnit,
        gapUnit?: EIntervalUnit
    ) {
        return await depositRequestRepository.amountMoneyDepositStatistics(
            time,
            unit,
            gapUnit
        );
    }

    async amountMoneyWithdrawalStatistics(
        time?: number,
        unit?: EIntervalUnit,
        gapUnit?: EIntervalUnit
    ) {
        return await withdrawalRequestRepository.amountMoneyWithdrawalStatistics(
            time,
            unit,
            gapUnit
        );
    }
}
