import { UpdateUserProfileRequest } from "@/common/requests/user/updateUserProfile.request";
import {
    likePostRepository,
    postRepository,
    userRepository,
} from "@/repositories";
import { errorService, utilService } from "@/services";

import {
    BasePrismaService,
    ICrudOptionPrisma,
} from "@/services/base/basePrisma.service";
import { ERROR_MESSAGE } from "@/services/errors/errorMessage";
import { Prisma, User } from "@prisma/client";

export class UserService extends BasePrismaService<typeof userRepository> {
    constructor() {
        super(userRepository);
    }

    async create(userCreateInput: Prisma.UserCreateInput): Promise<User> {
        return await this.repository.create(userCreateInput);
    }

    async findMany(query?: ICrudOptionPrisma) {
        return await this.repository.findMany(query);
    }

    async findOne(query?: ICrudOptionPrisma): Promise<User | null> {
        return await this.repository.findOne(query);
    }

    async findAndCountAll(query?: ICrudOptionPrisma) {
        return await this.repository.findAndCountAll(query);
    }

    async getInfoByUserId(userId: string) {
        const result: User | null = await this.repository.findOne({
            where: {
                id: userId,
            },
        });
        if (!result) {
            throw errorService.error(ERROR_MESSAGE.ACCOUNT_NOT_FOUND);
        }

        return utilService.exclude(result, [
            "createdAt",
            "updatedAt",
            "deletedAt",
            "ipv4",
            "password",
        ]);
    }

    async getUserBySlug(userSlug: string) {
        const result = await this.repository.getByIdOrSlug(userSlug);
        return result;
    }

    async updateUserProfile(
        userId: string,
        updateUserProfileRequest: UpdateUserProfileRequest
    ) {
        const user: User | null = await this.repository.findOne({
            where: {
                id: userId,
            },
        });
        if (!user) {
            throw errorService.error(ERROR_MESSAGE.ACCOUNT_NOT_FOUND);
        }
        const { slug } = updateUserProfileRequest;

        if (slug) {
            if (user.slug && slug != user.slug) {
                throw errorService.error(
                    ERROR_MESSAGE.EACH_USER_CAN_ONLY_UPDATE_THE_SLUG_ONCE
                );
            }
            const checkSlugExisted = await this.repository.findOne({
                where: {
                    OR: [
                        {
                            id: {
                                equals: slug,
                                not: user.id,
                            },
                        },
                        {
                            id: {
                                not: user.id,
                            },
                            slug: slug,
                        },
                    ],
                },
            });
            if (checkSlugExisted) {
                throw errorService.error(
                    ERROR_MESSAGE.EACH_USER_CAN_ONLY_UPDATE_THE_SLUG_ONCE
                );
            }
        }
        return await this.repository.updateUserProfileById(
            user.id,
            updateUserProfileRequest
        );
    }

    async updateBySlug(slug: string, userUpdateInput: Prisma.UserUpdateInput) {
        const user = await this.repository.findOne({
            where: {
                OR: [
                    {
                        slug,
                    },
                    {
                        id: slug,
                    },
                ],
            },
        });
        if (!user) {
            throw errorService.error(
                ERROR_MESSAGE.THIS_PROVIDER_DOES_NOT_EXISTED
            );
        }
        return await this.repository.updateUserProfileById(
            user.id,
            userUpdateInput
        );
    }

    async getAlbumByUserSlug(
        userSlug: string,
        queryInfoPrisma: ICrudOptionPrisma
    ) {
        const { skip, take } = queryInfoPrisma;
        const user = await this.repository.findOne({
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
            user?.id!,
            "IMAGE",
            take,
            skip
        );
    }

    async getPostsByUserSlug(
        userSlug: string,
        queryInfoPrisma: ICrudOptionPrisma
    ) {
        const user = await this.repository.findOne({
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
        if (!user) {
            throw errorService.badRequest();
        }

        const result = await postRepository.findAndCountAll({
            ...queryInfoPrisma,
            where: {
                userId: user.id,
            },
            select: {
                id: true,
                userId: true,
                content: true,
                thumbnails: true,
                user: {
                    select: {
                        id: true,
                        avatarUrl: true,
                        name: true,
                        slug: true,
                    },
                },

                _count: {
                    select: {
                        commentPosts: {
                            where: {
                                deletedAt: null,
                            },
                        },
                        likePosts: {
                            where: {
                                deletedAt: null,
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        const postIds = result.row.map((item) => item.id);
        const likePosts = await likePostRepository.findMany({
            where: {
                postId: {
                    in: postIds,
                },
                userId: user.id,
            },
        });
        const mappingLikePosts = utilService.convertArrayObjectToObject(
            likePosts,
            "id"
        );
        return {
            row: result.row.map((item) => {
                return {
                    ...item,
                    isLike: mappingLikePosts[item.id] ? true : false,
                    likeCount: item._count?.likePosts ?? 0,
                    commentCount: item._count?.commentPosts ?? 0,
                };
            }),
            count: result.count,
        };
    }
}
