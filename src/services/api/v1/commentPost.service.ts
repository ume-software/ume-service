import { commentPostRepository } from "@/repositories";
import {
    BasePrismaService,
    ICrudOptionPrisma,
} from "@/services/base/basePrisma.service";
import { Prisma, CommentPost } from "@prisma/client";

export class CommentPostService extends BasePrismaService<
    typeof commentPostRepository
> {
    constructor() {
        super(commentPostRepository);
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
        commentPostCreateInput: Prisma.CommentPostCreateInput
    ): Promise<CommentPost> {
        return await this.repository.create(commentPostCreateInput);
    }

    async findOne(query?: ICrudOptionPrisma): Promise<CommentPost | null> {
        return await this.repository.findOne(query);
    }
}
