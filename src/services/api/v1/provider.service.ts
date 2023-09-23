import { IOptionFilterHotProvider } from "@/common/interface/IOptionFilterHotProvider.interface";
import { IOptionFilterProvider } from "@/common/interface/IOptionFilterProvider.interface";
import { providerRepository, userRepository } from "@/repositories";
import {
    BasePrismaService,
    ICrudOptionPrisma,
} from "@/services/base/basePrisma.service";

export class ProviderService extends BasePrismaService<
    typeof providerRepository
> {
    constructor() {
        super(providerRepository);
    }
    async filterProvider(
        option: IOptionFilterProvider,
        query: ICrudOptionPrisma
    ) {
        // const { serviceId, startCost, endCost, name, gender } = option;
        return await this.repository.filterAndCountAllProvider(
            option,
            query?.skip,
            query?.take
        );
    }
    async filterHotProvider(
        option: IOptionFilterHotProvider,
        query: ICrudOptionPrisma
    ) {
        const { intervalDays } = option;
        return await this.repository.filterAndCountAllHotProvider(
            intervalDays,
            query?.skip,
            query?.take
        );
    }
    async findAndCountAll(query: ICrudOptionPrisma) {
        const result = await this.repository.findAndCountAll(query);

        return result;
    }

    async getProviderBySlug(slug: string) {
        return await userRepository.findOne({
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
            select: {
                id: true,
                avatarUrl: true,
                dob: true,
                gender: true,
                name: true,
                slug: true,
                isOnline: true,
                isProvider: true,
                createdAt: true,
                updatedAt: true,
                providerConfig: {
                    select: {
                        voiceUrl: true,
                        description: true,
                        status: true,
                    },
                },
                providerService: {
                    select: {
                        id: true,
                        serviceId: true,
                        service: true,
                        defaultCost: true,
                        description: true,
                        position: true,
                        bookingCosts: {
                            select: {
                                id: true,
                                amount: true,
                                endTimeOfDay: true,
                                startTimeOfDay: true,
                            },
                        },
                    },
                },
            },
        });
    }
}
