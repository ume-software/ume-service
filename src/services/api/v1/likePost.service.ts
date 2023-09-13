import { likePostRepository } from "@/repositories";
import { errorService } from "@/services";
import {
    BasePrismaService,
    ICrudOptionPrisma,
} from "@/services/base/basePrisma.service";
import { ERROR_MESSAGE } from "@/services/errors/errorMessage";
import { Prisma, LikePost } from "@prisma/client";

export class LikePostService extends BasePrismaService<
    typeof likePostRepository
> {
    constructor() {
        super(likePostRepository);
    }
    async findAndCountAll(query?: ICrudOptionPrisma) {
        if (!query) query = {};
        if (!query.include) query.include = {};
        query.include.user = {
            select: {
                id: true,
                avatarUrl: true,
                dob: true,
                name: true,
                slug: true,
                gender: true,
            },
        };
        const result = await this.repository.findAndCountAll(query);
        return result;
    }

    async create(
        likePostCreateInput: Prisma.LikePostCreateInput
    ): Promise<LikePost> {
        return await this.repository.create(likePostCreateInput);
    }

    async like(userId: string, postId: string) {
        if (!userId || !postId) {
            throw errorService.error(ERROR_MESSAGE.BAD_REQUEST);
        }
        const likeExisted = await this.repository.findOne({
            where: {
                userId,
                postId,
            },
        });
        if (likeExisted) {
            return likeExisted;
        }
        return await this.create({
            user: {
                connect: {
                    id: userId,
                },
            },
            post: {
                connect: {
                    id: postId,
                },
            },
        });
    }

    async unlike(userId: string, postId: string) {
        if (!userId || !postId) {
            throw errorService.error(ERROR_MESSAGE.BAD_REQUEST);
        }
        return await this.repository.destroyByUserIdAndPostId(userId, postId);
    }

    async destroyById(id: string) {
        return await this.repository.destroyById(id);
    }

    async findOne(query?: ICrudOptionPrisma): Promise<LikePost | null> {
        return await this.repository.findOne(query);
    }
}
