
import { postRepository } from "@/repositories";
import { identitySystemService, utilService } from "@/services";
import {
  BasePrismaService,
  ICrudOptionPrisma,
} from "@/services/base/basePrisma.service";
import { Prisma, Post } from "@prisma/client";

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
      result = await this.repository.suggestForUserId(userId, query?.take);
    } else {
      result = await this.repository.suggestForAnonymous(query?.take)
    }
    const userIds: string[] = result.row.map((item: any) => item.user_id);
    const listUsers = (await identitySystemService.getListByUserIds(userIds)).row;
    const mappingUser = utilService.convertArrayObjectToObject(listUsers, "id")
    result.row = result.row.map((item: any) => {
      return ({
        id: item.id,
        content: item.id,
        userId: item.user_id,
        user: mappingUser[item.user_id],
        thumbnails: item.thumbnails,
        createdAt: item.created_at,
        updatedAt: item.updated_at,
        deletedAt: item.deleted_at,
        likeCount: item.like_count,
        commentCount: item.comment_count
      })
    })
    return result;
  }

  async findAndCountAll(query?: ICrudOptionPrisma): Promise<{
    row: Post[];
    count: number;
  }> {
    return await this.repository.findAndCountAll(query);
  }

  async create(postCreateInput: Prisma.PostCreateInput): Promise<Post> {
    return await this.repository.create(postCreateInput);
  }

  async findOne(query?: ICrudOptionPrisma): Promise<Post | null> {
    return await this.repository.findOne(query);
  }


}
