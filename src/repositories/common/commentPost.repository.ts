import { ICrudOptionPrisma } from "@/services/base/basePrisma.service";
import {
  BasePrismaRepository,
  PrismaTransation,
} from "../base/basePrisma.repository";
import { Prisma, CommentPost } from "@prisma/client";

export class CommentPostRepository extends BasePrismaRepository {
  constructor() {
    super();
  }

  async findAndCountAll(query?: ICrudOptionPrisma): Promise<{
    row: CommentPost[];
    count: number;
  }> {
    const [row, count] = await this.prisma.$transaction([
      this.prisma.commentPost.findMany(query),
      this.prisma.commentPost.count({
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
    commentPostUpdateInput: Prisma.CommentPostUpdateInput,
    tx: PrismaTransation = this.prisma
  ) {
    return await tx.commentPost.update({ data: commentPostUpdateInput, where: { id } });
  }

  async update(
    commentPostUpdateInput: Prisma.CommentPostUpdateInput,
    query: ICrudOptionPrisma,
    tx: PrismaTransation = this.prisma
  ) {
    return await tx.commentPost.update({
      data: commentPostUpdateInput,
      where: query.where,
    });
  }

  async create(
    commentPostCreateInput: Prisma.CommentPostCreateInput,
    tx: PrismaTransation = this.prisma
  ): Promise<CommentPost> {
    return await tx.commentPost.create({ data: commentPostCreateInput });
  }

  async findOne(
    query?: ICrudOptionPrisma,
    tx: PrismaTransation = this.prisma
  ): Promise<CommentPost | null> {
    return await tx.commentPost.findFirst(query);
  }

  async findMany(
    query?: ICrudOptionPrisma,
    tx: PrismaTransation = this.prisma
  ): Promise<CommentPost[]> {
    return await tx.commentPost.findMany(query);
  }

  async deleteById(
    id: string,
    tx: PrismaTransation = this.prisma
  ): Promise<CommentPost> {
    return await tx.commentPost.delete({ where: { id } });
  }

  async deleteMany(
    CommentPostWhereInput: Prisma.CommentPostWhereInput,
    tx: PrismaTransation = this.prisma
  ): Promise<Prisma.BatchPayload> {
    return await tx.commentPost.deleteMany({ where: CommentPostWhereInput });
  }
}
