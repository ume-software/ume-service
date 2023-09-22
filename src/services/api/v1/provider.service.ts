import { IOptionFilterHotProvider } from "@/common/interface/IOptionFilterHotProvider.interface";
import { IOptionFilterProvider } from "@/common/interface/IOptionFilterProvider.interface";
import {
    UpdateProviderProfileRequest,
} from "@/common/requests";
import {
    postRepository,
    providerRepository,
    userRepository,
} from "@/repositories";
import { errorService } from "@/services";
import {
    BasePrismaService,
    ICrudOptionPrisma,
} from "@/services/base/basePrisma.service";
import { ERROR_MESSAGE } from "@/services/errors/errorMessage";

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
        const result = await this.repository.findAndCountAll(query);

        return result;
    }

    async getPersonalProfileByUserId(userId: string) {
        const result = await userRepository.getByIdOrSlug(userId);
        if (!result) {
            throw errorService.error(
                ERROR_MESSAGE.YOU_HAVE_NOT_BECOME_A_PROVIDER
            );
        }
        return result;
    }

    async getAlbumByUserSlug(
        userSlug: string,
        queryInfoPrisma: ICrudOptionPrisma
    ) {
        const { skip, take } = queryInfoPrisma;
        const provider = await userRepository.findOne({
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
        return await postRepository.getUrlThumbnailsByUserIdAndUrlType(
            provider?.id!,
            "IMAGE",
            take,
            skip
        );
    }

    async userUpdateUserProfile(
        updateUserProfileRequest: UpdateProviderProfileRequest
    ) {
        const provider = await userRepository.findOne({
            where: {
                userId: "updateUserProfileRequest.userId",
            },
        });
        if (!provider) {
            throw errorService.error(
                ERROR_MESSAGE.YOU_HAVE_NOT_BECOME_A_PROVIDER
            );
        }
        if (
            provider.slug &&
            updateUserProfileRequest.slug &&
            updateUserProfileRequest.slug != provider.slug
        ) {
            throw errorService.error(
                ERROR_MESSAGE.EACH_PROVIDER_CAN_ONLY_UPDATE_THE_SLUG_ONCE
            );
        }
        if (updateUserProfileRequest.slug) {
            const checkSlugExisted = await userRepository.findOne({
                where: {
                    slug: updateUserProfileRequest.slug,
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

        return await userRepository.updateById(
            provider.id,
            updateUserProfileRequest
        );
    }
}
