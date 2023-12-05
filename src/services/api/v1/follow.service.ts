import {
    followRepository,
    noticeRepository,
    userRepository,
} from "@/repositories";
import { errorService } from "@/services";
import {
    BasePrismaService,
    ICrudOptionPrisma,
} from "@/services/base/basePrisma.service";
import { ERROR_MESSAGE } from "@/services/errors/errorMessage";
import { Follow, NoticeType } from "@prisma/client";

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
        let result: any = await this.repository.create({
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

        result = await this.repository.findOne({
            where: {
                id: result.id,
            },
            include: {
                follower: {
                    select: {
                        id: true,
                        avatarUrl: true,
                        slug: true,
                        name: true,
                    },
                },
                following: {
                    select: {
                        id: true,
                        avatarUrl: true,
                        slug: true,
                        name: true,
                    },
                },
            },
        });

        noticeRepository.create({
            user: {
                connect: {
                    id: following.id,
                },
            },
            type: NoticeType.SOMEONE_FOLLOWING_YOU,
            data: JSON.parse(JSON.stringify(result)),
        });

        return result;
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
