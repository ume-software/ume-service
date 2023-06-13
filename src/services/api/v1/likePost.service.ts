
import { likePostRepository } from "@/repositories";
import { identitySystemService, utilService } from "@/services";
import {
  BasePrismaService,
  ICrudOptionPrisma,
} from "@/services/base/basePrisma.service";
import { Prisma, LikePost } from "@prisma/client";

export class LikePostService extends BasePrismaService<typeof likePostRepository> {
  constructor() {
    super(likePostRepository);
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

  async create(likePostCreateInput: Prisma.LikePostCreateInput): Promise<LikePost> {
    return await this.repository.create(likePostCreateInput);
  }

  async findOne(query?: ICrudOptionPrisma): Promise<LikePost | null> {
    return await this.repository.findOne(query);
  }


}
