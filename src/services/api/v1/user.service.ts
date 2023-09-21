import { UpdateUserProfileRequest } from "@/common/requests/user/updateUserProfile.request";
import { userRepository } from "@/repositories";
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
            throw errorService.error(
                ERROR_MESSAGE.ACCOUNT_NOT_FOUND
            );
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
            throw errorService.error(
                ERROR_MESSAGE.ACCOUNT_NOT_FOUND
            );
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
}
