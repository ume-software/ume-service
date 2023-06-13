
import { commentPostRepository } from "@/repositories";
import {
  BasePrismaService,
  ICrudOptionPrisma,
} from "@/services/base/basePrisma.service";
import { Prisma, CommentPost } from "@prisma/client";

export class CommentPostService extends BasePrismaService<typeof commentPostRepository> {
  constructor() {
    super(commentPostRepository);
  }

  async create(commentPostCreateInput: Prisma.CommentPostCreateInput): Promise<CommentPost> {
    return await this.repository.create(commentPostCreateInput);
  }

  async findOne(query?: ICrudOptionPrisma): Promise<CommentPost | null> {
    return await this.repository.findOne(query);
  }

 
}
