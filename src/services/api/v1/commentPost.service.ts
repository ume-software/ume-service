
import { commentPostRepository } from "@/repositories";
import { identitySystemService, utilService } from "@/services";
import {
  BasePrismaService,
  ICrudOptionPrisma,
} from "@/services/base/basePrisma.service";
import { Prisma, CommentPost } from "@prisma/client";

export class CommentPostService extends BasePrismaService<typeof commentPostRepository> {
  constructor() {
    super(commentPostRepository);
  }

  async findAndCountAll(query?: ICrudOptionPrisma) {
    const result = await this.repository.findAndCountAll(query);
    try {
      const userIds: string[] = result.row.map(item => item.userId);
      const listUsers = (await identitySystemService.getListByUserIds(userIds)).row;
      const mappingUser = utilService.convertArrayObjectToObject(listUsers, "id");
      result.row = result.row.map(item => {
        return {
          ...item,
          user: mappingUser[item.userId]
        }
      })
    } catch {

    }

    return result;
  }

  async create(commentPostCreateInput: Prisma.CommentPostCreateInput): Promise<CommentPost> {
    return await this.repository.create(commentPostCreateInput);
  }

  async findOne(query?: ICrudOptionPrisma): Promise<CommentPost | null> {
    return await this.repository.findOne(query);
  }


}
