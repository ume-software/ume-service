import {
    AdminHandleUserKYCRequestRequest,
    UserSendKYCRequest,
} from "@/common/requests";
import { UpdateUserProfileRequest } from "@/common/requests/user/updateUserProfile.request";
import prisma from "@/models/base.prisma";
import {
    bookingHistoryRepository,
    likePostRepository,
    noticeRepository,
    postRepository,
    providerConfigRepository,
    userKYCRequestRepository,
    userRepository,
} from "@/repositories";
import { errorService, utilService } from "@/services";

import {
    BasePrismaService,
    ICrudOptionPrisma,
} from "@/services/base/basePrisma.service";
import { ERROR_MESSAGE } from "@/services/errors/errorMessage";
import {
    NoticeType,
    Prisma,
    ProviderStatus,
    User,
    UserKYCStatus,
} from "@prisma/client";

export class UserService extends BasePrismaService<typeof userRepository> {
    constructor() {
        super(userRepository);
    }
    async checkSlugUserExisted(slug: string) {
        if (!slug) return false;
        return !!(await this.repository.findOne({
            where: {
                slug,
            },
        }));
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
    async adminGetListUserKYCRequest(query?: ICrudOptionPrisma) {
        return await userKYCRequestRepository.findAndCountAll(query);
    }

    async adminGetUserKYCRequest(query?: ICrudOptionPrisma) {
        return await userKYCRequestRepository.findOne(query);
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
    async getBookingCanFeedbackByUserSlug(
        providerSlug: string,
        bookerId: string
    ) {
        const provider = await this.repository.findOne({
            where: {
                OR: [
                    {
                        id: providerSlug,
                    },
                    {
                        slug: providerSlug,
                    },
                ],
                isProvider: true,
            },
        });
        if (!provider) return null;
        const booking =
            await bookingHistoryRepository.getBookingCanFeedbackByUserSlug(
                provider.id,
                bookerId
            );

        return booking.length >= 0 ? booking[0] : null;
    }
    async userSendKYCRequest(
        userId: string,
        userKYCRequest: UserSendKYCRequest
    ) {
        const userKYCRequestExisted = await userKYCRequestRepository.findOne({
            where: {
                userId,
            },
        });
        if (!userKYCRequestExisted) {
            return await userKYCRequestRepository.create({
                ...userKYCRequest,
                user: {
                    connect: {
                        id: userId,
                    },
                },
            });
        }
        return await prisma.$transaction(async (tx) => {
            await userRepository.updateById(userId, { isVerified: false }, tx);
            return await userKYCRequestRepository.update(
                {
                    ...userKYCRequest,
                    user: {
                        connect: {
                            id: userId,
                        },
                    },
                },
                { where: { id: userKYCRequestExisted.id } }
            );
        });
    }
    async userBecomeProvider(userId: string) {
        const user = await userRepository.findOne({
            where: {
                id: userId,
            },
        });
        if (!user?.isVerified) {
            throw errorService.error(
                ERROR_MESSAGE.USER_NEED_VERIFY_ACCOUNT_BEFORE_BECOME_PROVIDER
            );
        }
        await providerConfigRepository.create({
            user: {
                connect: {
                    id: userId,
                },
            },
            status: ProviderStatus.ACTIVATED,
        });
        return await userRepository.updateById(userId, {
            isProvider: true,
        });
    }
    async adminHandleUserKYCRequest(
        adminHandleUserKYCRequestRequest: AdminHandleUserKYCRequestRequest
    ) {
        const userKYCRequest = await userKYCRequestRepository.findOne({
            where: {
                id: adminHandleUserKYCRequestRequest.id,
            },
        });
        if (!userKYCRequest) {
            throw errorService.recordNotFound();
        }
        if (userKYCRequest.userKYCStatus != UserKYCStatus.PENDING) {
            throw errorService.badRequest(
                ERROR_MESSAGE.THE_KYC_REQUEST_HAS_BEEN_PROCESSED_PERVIOUSLY
            );
        }

        return await prisma.$transaction(async (tx) => {
            await noticeRepository.create(
                {
                    user: {
                        connect: {
                            id: userKYCRequest.userId,
                        },
                    },
                    type:
                        adminHandleUserKYCRequestRequest.userKYCStatus ==
                        UserKYCStatus.APPROVED
                            ? NoticeType.ADMIN_HAS_APPROVED_KYC_REQUEST
                            : NoticeType.ADMIN_HAS_REJECTED_KYC_REQUEST,
                    data: JSON.parse(
                        JSON.stringify(adminHandleUserKYCRequestRequest)
                    ),
                },
                tx
            );
            await userRepository.updateById(
                userKYCRequest.userId,
                {
                    isVerified:
                        adminHandleUserKYCRequestRequest.userKYCStatus ==
                        UserKYCStatus.APPROVED
                            ? true
                            : false,
                },
                tx
            );
            return await userKYCRequestRepository.update(
                {
                    userKYCStatus:
                        adminHandleUserKYCRequestRequest.userKYCStatus,
                },
                {
                    where: {
                        id: userKYCRequest.id,
                    },
                },
                tx
            );
        });
    }
}
