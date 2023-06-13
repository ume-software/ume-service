
import { likePostRepository } from "@/repositories";
import {
  BasePrismaService,
  ICrudOptionPrisma,
} from "@/services/base/basePrisma.service";
import { Prisma, LikePost } from "@prisma/client";

export class LikePostService extends BasePrismaService<typeof likePostRepository> {
  constructor() {
    super(likePostRepository);
  }

  async create(likePostCreateInput: Prisma.LikePostCreateInput): Promise<LikePost> {
    return await this.repository.create(likePostCreateInput);
  }

  async findOne(query?: ICrudOptionPrisma): Promise<LikePost | null> {
    return await this.repository.findOne(query);
  }

 
}
