import { CreateNewPostRequest } from "@/common/requests/post/createNewPost.request";
import { postRepository } from "@/repositories";
import { identitySystemService, utilService } from "@/services";
import {
    BasePrismaService,
    ICrudOptionPrisma,
} from "@/services/base/basePrisma.service";
import { Post } from "@prisma/client";

export class PostService extends BasePrismaService<typeof postRepository> {
    constructor() {
        super(postRepository);
    }
    async suggestPost(userId?: string, query?: ICrudOptionPrisma) {
        let result: {
            row: any;
            count: any;
        };
        if (userId) {
            result = await this.repository.suggestForUserId(
                userId,
                query?.take
            );
        } else {
            result = await this.repository.suggestForAnonymous(query?.take);
        }
        const userIds: string[] = result.row.map((item: any) => item.user_id);
        let listUsers = [];
        try {
            listUsers = await identitySystemService.getListByUserIds(userIds);
        } catch {}
        const mappingUser = utilService.convertArrayObjectToObject(
            listUsers,
            "id"
        );
        console.log("listUsers ===> ", listUsers);
        result.row = result.row.map((item: any) => {
            return {
                id: item.id,
                content: item.content,
                userId: item.user_id,
                user: mappingUser[item.user_id],
                thumbnails: item.thumbnails,
                createdAt: item.created_at,
                updatedAt: item.updated_at,
                deletedAt: item.deleted_at,
                likeCount: item.like_count,
                isLike: item.is_like,
                commentCount: item.comment_count,
            };
        });
        return result;
    }

    async findAndCountAll(query?: ICrudOptionPrisma): Promise<{
        row: Post[];
        count: number;
    }> {
        return await this.repository.findAndCountAll(query);
    }

    async create(
        creatorId: string,
        createNewPostRequest: CreateNewPostRequest
    ): Promise<Post> {
        const { content, thumbnails } = createNewPostRequest;
        return await this.repository.create({
            user: {
                connect: {
                    id: creatorId,
                },
            },
            content,
            thumbnails: thumbnails as any,
        });
    }

    async findOne(query?: ICrudOptionPrisma): Promise<Post | null> {
        return await this.repository.findOne(query);
    }

    async findById(postId: string) {
        const post = await this.repository.findById(postId);
        if (post) {
            let listUsers = [];
            try {
                listUsers = await identitySystemService.getListByUserIds([
                    post.userId,
                ]);
            } catch {}
            const mappingUser = utilService.convertArrayObjectToObject(
                listUsers,
                "id"
            );
            return {
                id: post.id,
                content: post.id,
                userId: post.userId,
                user: mappingUser[post.userId],
                thumbnails: post.thumbnails,
                createdAt: post.createdAt,
                updatedAt: post.updatedAt,
                deletedAt: post.deletedAt,
                likeCount: post._count?.likePosts,
                commentCount: post._count?.commentPosts,
            };
        }
        return null;
    }
}
