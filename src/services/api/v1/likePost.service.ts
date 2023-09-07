
import { likePostRepository } from "@/repositories";
import { errorService, identitySystemService, utilService } from "@/services";
import {
  BasePrismaService,
  ICrudOptionPrisma,
} from "@/services/base/basePrisma.service";
import { ERROR_MESSAGE } from "@/services/errors/errorMessage";
import { Prisma, LikePost } from "@prisma/client";

export class LikePostService extends BasePrismaService<typeof likePostRepository> {
  constructor() {
    super(likePostRepository);
  }
  async findAndCountAll(query?: ICrudOptionPrisma) {
    const result = await this.repository.findAndCountAll(query);
    try {
      const userIds: string[] = result.row.map(item => item.userId);
      const listUsers = (await identitySystemService.getListByUserIds(userIds));
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

  async like(userId: string, postId: string) {
    if (!userId || !postId) {
      throw errorService.error(ERROR_MESSAGE.BAD_REQUEST);
    }
    const likeExisted = await this.repository.findOne({
      where: {
        userId,
        postId
      }
    })
    if (likeExisted) {
      return likeExisted;
    }
    return await this.create({
      user: {
        connect: {
          id: userId
        }
      },
      post: {
        connect: {
          id: postId
        }
      }
    })
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
