import { EIntervalUnit } from "@/enums/intervalUnit.enum";
import {
    bookingHistoryRepository,
    depositRequestRepository,
    providerConfigRepository,
    providerServiceRepository,
    userRepository,
    withdrawalRequestRepository,
} from "@/repositories";

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
        return { totalUser, totalUserIsBanned, totalUserIsVerified };
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

    async getMostProviderServicesStatistics() {
        return await providerServiceRepository.getMostProviderServicesStatistics();
    }
    async getMostBookingServicesStatistics() {
        return await bookingHistoryRepository.getMostBookingServicesStatistics();
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
