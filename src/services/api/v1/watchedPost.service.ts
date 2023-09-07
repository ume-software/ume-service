import { watchedPostRepository } from "@/repositories";
import { errorService } from "@/services";
import {
  BasePrismaService,
} from "@/services/base/basePrisma.service";
import { ERROR_MESSAGE } from "@/services/errors/errorMessage";
import { WatchedPost } from "@prisma/client";

export class WatchedPostService extends BasePrismaService<typeof watchedPostRepository> {
  constructor() {
    super(watchedPostRepository);
  }


  async create(userId: string, postId: string): Promise<WatchedPost> {
    if (!userId || !postId) {
      throw errorService.error(ERROR_MESSAGE.BAD_REQUEST);
    }
    const watchedPostExisted = await this.repository.findOne({
      where: {
        userId,
        postId
      }
    })
    if (watchedPostExisted) {
      return watchedPostExisted;
    }
    console.log({
      userId,
      postId
    })
    return await this.repository.create({
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


}
