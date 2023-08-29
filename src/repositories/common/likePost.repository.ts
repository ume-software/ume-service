import { ICrudOptionPrisma } from "@/services/base/basePrisma.service";
import {
  BasePrismaRepository,
  PrismaTransaction,
} from "../base/basePrisma.repository";
import { Prisma, LikePost } from "@prisma/client";

export class LikePostRepository extends BasePrismaRepository {
  constructor() {
    super();
  }

  async findAndCountAll(query?: ICrudOptionPrisma): Promise<{
    row: LikePost[];
    count: number;
  }> {
    const [row, count] = await this.prisma.$transaction([
      this.prisma.likePost.findMany(query),
      this.prisma.likePost.count({
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
    likePostUpdateInput: Prisma.LikePostUpdateInput,
    tx: PrismaTransaction = this.prisma
  ) {
    return await tx.likePost.update({ data: likePostUpdateInput, where: { id } });
  }

  async update(
    likePostUpdateInput: Prisma.LikePostUpdateInput,
    query: ICrudOptionPrisma,
    tx: PrismaTransaction = this.prisma
  ) {
    return await tx.likePost.update({
      data: likePostUpdateInput,
      where: query.where,
    });
  }

  async create(
    likePostCreateInput: Prisma.LikePostCreateInput,
    tx: PrismaTransaction = this.prisma
  ): Promise<LikePost> {
    return await tx.likePost.create({ data: likePostCreateInput });
  }

  async findOne(
    query?: ICrudOptionPrisma,
    tx: PrismaTransaction = this.prisma
  ): Promise<LikePost | null> {
    return await tx.likePost.findFirst(query);
  }

  async findMany(
    query?: ICrudOptionPrisma,
    tx: PrismaTransaction = this.prisma
  ): Promise<LikePost[]> {
    return await tx.likePost.findMany(query);
  }

  async deleteById(
    id: string,
    tx: PrismaTransaction = this.prisma
  ): Promise<LikePost> {
    return await tx.likePost.delete({ where: { id } });
  }

  async deleteMany(
    LikePostWhereInput: Prisma.LikePostWhereInput,
    tx: PrismaTransaction = this.prisma
  ): Promise<Prisma.BatchPayload> {
    return await tx.likePost.deleteMany({ where: LikePostWhereInput });
  }

  async destroyByUserIdAndPostId(
    userId: string,
    postId: string
  ) {
    const query = `DELETE FROM like_post WHERE post_id='${postId}' AND user_id='${userId}';`
    return await this.prisma.$queryRawUnsafe(query);
  }

  async destroyById(
    id: string
  ) {
    const query = `DELETE FROM like_post WHERE id='${id}';`
    return await this.prisma.$queryRawUnsafe(query);
  }
}
