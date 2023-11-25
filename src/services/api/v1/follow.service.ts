import { followRepository, userRepository } from "@/repositories";
import { errorService } from "@/services";
import {
    BasePrismaService,
    ICrudOptionPrisma,
} from "@/services/base/basePrisma.service";
import { ERROR_MESSAGE } from "@/services/errors/errorMessage";
import { Follow } from "@prisma/client";

export class FollowService extends BasePrismaService<typeof followRepository> {
    constructor() {
        super(followRepository);
    }

    async findAndCountAll(query?: ICrudOptionPrisma): Promise<{
        row: Follow[];
        count: number;
    }> {
        return await this.repository.findAndCountAll(query);
    }
    async findOne(query?: ICrudOptionPrisma) {
        return await this.repository.findOne(query);
    }

    async create(followerId: string, followingId: string): Promise<Follow> {
        const following = await userRepository.findOne({
            where: { OR: [{ slug: followingId }, { id: followingId }] },
        });
        if (!following) {
            throw errorService.error(ERROR_MESSAGE.USER_NOT_FOUND);
        }
        const follow = await this.repository.findOne({
            where: {
                followerId,
                followingId: following.id,
            },
        });
        if (follow) return follow;
        return await this.repository.create({
            follower: {
                connect: {
                    id: followerId,
                },
            },
            following: {
                connect: {
                    id: following.id,
                },
            },
        });
    }
    async unFollow(followerId: string, followingId: string): Promise<Follow> {
        const following = await userRepository.findOne({
            where: { OR: [{ slug: followingId }, { id: followingId }] },
        });
        if (!following) {
            throw errorService.error(ERROR_MESSAGE.USER_NOT_FOUND);
        }
        const follow = await this.repository.findOne({
            where: {
                followerId,
                followingId: following.id,
            },
        });
        if (!follow) throw errorService.recordNotFound();
        await this.repository.destroyById(follow.id);
        return follow;
    }
}
