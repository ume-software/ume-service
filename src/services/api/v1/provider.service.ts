import { IOptionFilterHotProvider } from "@/common/interface/IOptionFilterHotProvider.interface";
import { IOptionFilterProvider } from "@/common/interface/IOptionFilterProvider.interface";
import {
    AdminHandleBanProviderRequest,
    UpdateProviderProfileRequest,
} from "@/common/requests";
import prisma from "@/models/base.prisma";
import {
    noticeRepository,
    providerConfigRepository,
    providerRepository,
    userRepository,
} from "@/repositories";
import { errorService } from "@/services";
import {
    BasePrismaService,
    ICrudOptionPrisma,
} from "@/services/base/basePrisma.service";
import { ERROR_MESSAGE } from "@/services/errors/errorMessage";
import { NoticeType, ProviderConfig, User } from "@prisma/client";

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
                            where: {
                                deletedAt: null,
                            },
                        },
                    },
                    where: {
                        deletedAt: null,
                    },
                },
            },
        });
    }

    async adminHandleBanProvider(
        adminHandleBanProviderRequest: AdminHandleBanProviderRequest
    ) {
        const provider = (await userRepository.findOne({
            where: {
                OR: [
                    {
                        id: adminHandleBanProviderRequest.providerId,
                    },
                    {
                        slug: adminHandleBanProviderRequest.providerId,
                    },
                ],
            },
            include: {
                providerConfig: true,
            },
        })) as User & { providerConfig: ProviderConfig };

        if (!provider) {
            throw errorService.error(
                ERROR_MESSAGE.THIS_PROVIDER_DOES_NOT_EXISTED
            );
        }
        if (!provider.isProvider || !provider.providerConfig) {
            throw errorService.error(ERROR_MESSAGE.THIS_IS_NOT_A_PROVIDER);
        }

        switch (adminHandleBanProviderRequest.isBanned) {
            case true: {
                if (provider.providerConfig.isBanned) {
                    throw errorService.error(
                        ERROR_MESSAGE.THIS_PROVIDER_HAS_BEEN_BANNED_BEFORE
                    );
                }
                break;
            }
            case false: {
                if (!provider.providerConfig.isBanned) {
                    throw errorService.error(
                        ERROR_MESSAGE.THIS_PROVIDER_HAS_BEEN_UN_BANNED_BEFORE_OR_HAS_NEVER_BEEN_BANNED
                    );
                }
                break;
            }
        }
        return await prisma.$transaction(async (tx) => {
            await noticeRepository.create(
                {
                    user: {
                        connect: {
                            id: provider.id,
                        },
                    },
                    type: adminHandleBanProviderRequest.isBanned
                        ? NoticeType.ADMIN_HAS_BANNED_PROVIDER
                        : NoticeType.ADMIN_HAS_UN_BANNED_PROVIDER,
                    data: JSON.parse(
                        JSON.stringify(adminHandleBanProviderRequest)
                    ),
                },
                tx
            );
            await providerConfigRepository.update(
                {
                    isBanned: adminHandleBanProviderRequest.isBanned,
                },
                {
                    where: {
                        userId: provider.id,
                    },
                },
                tx
            );
            if (adminHandleBanProviderRequest.isBanned == true) {
                noticeRepository.create({
                    user: {
                        connect: {
                            id: provider.id,
                        },
                    },
                    type: NoticeType.ADMIN_HAS_BANNED_PROVIDER,
                });
            } else if (adminHandleBanProviderRequest.isBanned == false) {
                noticeRepository.create({
                    user: {
                        connect: {
                            id: provider.id,
                        },
                    },
                    type: NoticeType.ADMIN_HAS_UN_BANNED_PROVIDER,
                });
            }
            return userRepository.findOne(
                {
                    where: {
                        id: provider.id,
                    },
                    include: {
                        providerConfig: true,
                    },
                },
                tx
            );
        });
    }

    async updateProviderProfile(
        updateProviderProfileRequest: UpdateProviderProfileRequest
    ) {
        return await providerConfigRepository.update(
            updateProviderProfileRequest,
            {
                where: {
                    userId: updateProviderProfileRequest.userId,
                },
            }
        );
    }
}
