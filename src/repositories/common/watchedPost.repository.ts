import { ICrudOptionPrisma } from "@/services/base/basePrisma.service";
import {
  BasePrismaRepository,
  PrismaTransation,
} from "../base/basePrisma.repository";
import { Prisma, WatchedPost } from "@prisma/client";

export class WatchedPostRepository extends BasePrismaRepository {
  constructor() {
    super();
  }

  async findAndCountAll(query?: ICrudOptionPrisma): Promise<{
    row: WatchedPost[];
    count: number;
  }> {
    const [row, count] = await this.prisma.$transaction([
      this.prisma.watchedPost.findMany(query),
      this.prisma.watchedPost.count({
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
    watchedPostUpdateInput: Prisma.WatchedPostUpdateInput,
    tx: PrismaTransation = this.prisma
  ) {
    return await tx.watchedPost.update({ data: watchedPostUpdateInput, where: { id } });
  }

  async update(
    watchedPostUpdateInput: Prisma.WatchedPostUpdateInput,
    query: ICrudOptionPrisma,
    tx: PrismaTransation = this.prisma
  ) {
    return await tx.watchedPost.update({
      data: watchedPostUpdateInput,
      where: query.where,
    });
  }

  async create(
    watchedPostCreateInput: Prisma.WatchedPostCreateInput,
    tx: PrismaTransation = this.prisma
  ): Promise<WatchedPost> {
    return await tx.watchedPost.create({ data: watchedPostCreateInput });
  }

  async findOne(
    query?: ICrudOptionPrisma,
    tx: PrismaTransation = this.prisma
  ): Promise<WatchedPost | null> {
    return await tx.watchedPost.findFirst(query);
  }

  async findMany(
    query?: ICrudOptionPrisma,
    tx: PrismaTransation = this.prisma
  ): Promise<WatchedPost[]> {
    return await tx.watchedPost.findMany(query);
  }

  async deleteById(
    id: string,
    tx: PrismaTransation = this.prisma
  ): Promise<WatchedPost> {
    return await tx.watchedPost.delete({ where: { id } });
  }

  async deleteMany(
    watchedPostWhereInput: Prisma.WatchedPostWhereInput,
    tx: PrismaTransation = this.prisma
  ): Promise<Prisma.BatchPayload> {
    return await tx.watchedPost.deleteMany({ where: watchedPostWhereInput });
  }
}
