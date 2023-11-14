import { EIntervalUnit } from "@/enums/intervalUnit.enum";
import { providerConfigRepository, providerServiceRepository, userRepository } from "@/repositories";

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

    async getMostProviderServicesStatistics(){
        return await providerServiceRepository.getMostProviderServicesStatistics()
    }
}
