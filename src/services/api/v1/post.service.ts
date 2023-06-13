
import { postRepository } from "@/repositories";
import {
  BasePrismaService,
  ICrudOptionPrisma,
} from "@/services/base/basePrisma.service";
import { Prisma, Post } from "@prisma/client";

export class PostService extends BasePrismaService<typeof postRepository> {
  constructor() {
    super(postRepository);
  }

  async create(postCreateInput: Prisma.PostCreateInput): Promise<Post> {
    return await this.repository.create(postCreateInput);
  }

  async findOne(query?: ICrudOptionPrisma): Promise<Post | null> {
    return await this.repository.findOne(query);
  }

 
}
