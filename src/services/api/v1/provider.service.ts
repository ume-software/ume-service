import { IOptionFilterHotProvider } from "@/common/interface/IOptionFilterHotProvider.interface";
import { IOptionFilterProvider } from "@/common/interface/IOptionFilterProvider.interface";
import { BecomeProviderRequest } from "@/common/requests/provider/becomeProvider.request";
import { UpdateProviderProfileRequest } from "@/common/requests/provider/updateProviderProfile.request";
import { BecomeProviderResponse } from "@/common/responses/provider/becomeProvider.response";
import { postRepository, providerRepository } from "@/repositories";
import { errorService } from "@/services";
import {
    BasePrismaService,
    ICrudOptionPrisma,
} from "@/services/base/basePrisma.service";
import { ERROR_MESSAGE } from "@/services/errors/errorMessage";
import { Prisma, Provider } from "@prisma/client";

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
        // const { skillId, startCost, endCost, name, gender } = option;
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
        if (!query.include) query.include = {};
        query.include = {
            ...query.include,
            providerSkills: {
                include: {
                    bookingCosts: true,
                },
            },
        };
        const result = await this.repository.findAndCountAll(query);

        return result;
    }

    async adminFindAndCountAll(query: ICrudOptionPrisma) {
        const result = await this.repository.findAndCountAll(query);

        return result;
    }
    async getProviderBySlug(userSlug: string) {
        return await this.repository.getByIdOrSlug(userSlug);
    }

    async getPersonalProfileByUserId(userId: string) {
        const result = await this.repository.getByIdOrSlug(userId);
        if (!result) {
            throw errorService.error(
                ERROR_MESSAGE.YOU_HAVE_NOT_BECOME_A_PROVIDER
            );
        }
        return result;
    }

    async getAlbumByProviderSlug(
        userSlug: string,
        queryInfoPrisma: ICrudOptionPrisma
    ) {
        const { skip, take } = queryInfoPrisma;
        const provider = await this.repository.findOne({
            where: {
                OR: [
                    {
                        id: userSlug,
                    },
                    {
                        slug: userSlug,
                    },
                ],
            },
        });
        return await postRepository.getUrlThumnailsByUserIdAndUrlType(
            provider?.userId!,
            "IMAGE",
            take,
            skip
        );
    }

    async becomeProvider(
        userId: string,
        becomeProviderRequest: BecomeProviderRequest
    ): Promise<BecomeProviderResponse> {
        const preExistingProvider = await this.repository.findOne({
            where: {
                userId,
            },
        });
        if (preExistingProvider) {
            throw errorService.error(ERROR_MESSAGE.YOU_ARE_ALREADY_A_PROVIDER);
        }

        const result = await this.repository.create({
            user: {
                connect: {
                    id: userId,
                },
            },
            ...becomeProviderRequest,
        });
        if (becomeProviderRequest.slug) {
            const checkSlugExisted = await this.repository.findOne({
                where: {
                    slug: becomeProviderRequest.slug,
                },
            });
            if (checkSlugExisted) {
                throw errorService.error(
                    ERROR_MESSAGE.THIS_SLUG_ALREADY_EXISTS_AT_ANOTHER_PROVIDER
                );
            }
        }
        return result as BecomeProviderResponse;
    }

    async userUpdateProviderProfile(
        updateProviderProfileRequest: UpdateProviderProfileRequest
    ) {
        const provider = await this.repository.findOne({
            where: {
                userId: updateProviderProfileRequest.userId,
            },
        });
        if (!provider) {
            throw errorService.error(
                ERROR_MESSAGE.YOU_HAVE_NOT_BECOME_A_PROVIDER
            );
        }
        if (
            provider.slug &&
            updateProviderProfileRequest.slug &&
            updateProviderProfileRequest.slug != provider.slug
        ) {
            throw errorService.error(
                ERROR_MESSAGE.EACH_PROVIDER_CAN_ONLY_UPDATE_THE_SLUG_ONCE
            );
        }
        if (updateProviderProfileRequest.slug) {
            const checkSlugExisted = await this.repository.findOne({
                where: {
                    slug: updateProviderProfileRequest.slug,
                    id: {
                        not: provider.id,
                    },
                },
            });
            if (checkSlugExisted) {
                throw errorService.error(
                    ERROR_MESSAGE.THIS_SLUG_ALREADY_EXISTS_AT_ANOTHER_PROVIDER
                );
            }
        }

        return await this.repository.updateById(
            provider.id,
            updateProviderProfileRequest
        );
    }
    async create(
        providerCreateInput: Prisma.ProviderCreateInput
    ): Promise<Provider> {
        return await this.repository.create(providerCreateInput);
    }

    async findOne(query?: ICrudOptionPrisma): Promise<Provider | null> {
        return await this.repository.findOne(query);
    }
}
