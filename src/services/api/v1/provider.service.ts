import { IOptionFilterHotProvider } from "@/common/interface/IOptionFilterHotProvider.interface";
import { IOptionFilterProvider } from "@/common/interface/IOptionFilterProvider.interface";
import { AdminHandleBanProviderRequest } from "@/common/requests/provider/adminHandleBanProvider.request";
import {
    providerConfigRepository,
    providerRepository,
    userRepository,
} from "@/repositories";
import { errorService, noticeService } from "@/services";
import {
    BasePrismaService,
    ICrudOptionPrisma,
} from "@/services/base/basePrisma.service";
import { ERROR_MESSAGE } from "@/services/errors/errorMessage";
import { NoticeType } from "@prisma/client";

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
                providerServices: {
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

    async adminHandleBanProvider(
        adminHandleBanProviderRequest: AdminHandleBanProviderRequest
    ) {
        const provider = await userRepository.findOne({
            where: {
                id: adminHandleBanProviderRequest.providerId,
            },
        });
        if (!provider) {
            throw errorService.error(
                ERROR_MESSAGE.THIS_PROVIDER_DOES_NOT_EXISTED
            );
        }
        if (!provider.isProvider) {
            throw errorService.error(ERROR_MESSAGE.THIS_IS_NOT_A_PROVIDER);
        }
        switch (adminHandleBanProviderRequest.isBanned) {
            case true: {
                if (provider.isBanned) {
                    throw errorService.error(
                        ERROR_MESSAGE.THIS_PROVIDER_HAS_BEEN_BANNED_BEFORE
                    );
                }
                break;
            }
            case false: {
                if (!provider.isBanned) {
                    throw errorService.error(
                        ERROR_MESSAGE.THIS_PROVIDER_HAS_BEEN_UN_BANNED_BEFORE_OR_HAS_NEVER_BEEN_BANNED
                    );
                }
                break;
            }
        }

        noticeService.create({
            user: {
                connect: {
                    id: provider.id,
                },
            },
            type: adminHandleBanProviderRequest.isBanned
                ? NoticeType.ADMIN_HAS_BANNED_PROVIDER
                : NoticeType.ADMIN_HAS_UN_BANNED_PROVIDER,
            data: JSON.parse(JSON.stringify(adminHandleBanProviderRequest)),
        });
        return await providerConfigRepository.update(
            {
                isBanned: adminHandleBanProviderRequest.isBanned,
            },
            {
                where: {
                    providerId: provider.id,
                },
            }
        );
    }
}
