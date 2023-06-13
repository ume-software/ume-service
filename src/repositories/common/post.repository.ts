import { ICrudOptionPrisma } from "@/services/base/basePrisma.service";
import {
  BasePrismaRepository,
  PrismaTransation,
} from "../base/basePrisma.repository";
import { Prisma, Post } from "@prisma/client";

export class PostRepository extends BasePrismaRepository {
  constructor() {
    super();
  }

  async findAndCountAll(query?: ICrudOptionPrisma): Promise<{
    row: Post[];
    count: number;
  }> {
    const [row, count] = await this.prisma.$transaction([
      this.prisma.post.findMany(query),
      this.prisma.post.count({
        where: query?.where,
      }),
    ]);
    return {
      row,
      count,
    };
  }

  async updateById(
    id: string,
    postUpdateInput: Prisma.PostUpdateInput,
    tx: PrismaTransation = this.prisma
  ) {
    return await tx.post.update({ data: postUpdateInput, where: { id } });
  }

  async update(
    postUpdateInput: Prisma.PostUpdateInput,
    query: ICrudOptionPrisma,
    tx: PrismaTransation = this.prisma
  ) {
    return await tx.post.update({
      data: postUpdateInput,
      where: query.where,
    });
  }

  async create(
    postCreateInput: Prisma.PostCreateInput,
    tx: PrismaTransation = this.prisma
  ): Promise<Post> {
    return await tx.post.create({ data: postCreateInput });
  }

  async findOne(
    query?: ICrudOptionPrisma,
    tx: PrismaTransation = this.prisma
  ): Promise<Post | null> {
    return await tx.post.findFirst(query);
  }

  async findMany(
    query?: ICrudOptionPrisma,
    tx: PrismaTransation = this.prisma
  ): Promise<Post[]> {
    return await tx.post.findMany(query);
  }

  async deleteById(
    id: string,
    tx: PrismaTransation = this.prisma
  ): Promise<Post> {
    return await tx.post.delete({ where: { id } });
  }

  async deleteMany(
    postWhereInput: Prisma.PostWhereInput,
    tx: PrismaTransation = this.prisma
  ): Promise<Prisma.BatchPayload> {
    return await tx.post.deleteMany({ where: postWhereInput });
  }
}
