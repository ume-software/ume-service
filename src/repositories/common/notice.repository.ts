import { ICrudOptionPrisma } from "@/services/base/basePrisma.service";
import {
  BasePrismaRepository,
  PrismaTransation,
} from "../base/basePrisma.repository";
import { Prisma, Notice } from "@prisma/client";

export class NoticeRepository extends BasePrismaRepository {
  constructor() {
    super();
  }

  async findAndCountAll(query?: ICrudOptionPrisma): Promise<{
    row: Notice[];
    count: number;
  }> {
    const [row, count] = await this.prisma.$transaction([
      this.prisma.notice.findMany(query),
      this.prisma.notice.count({
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
    noticeUpdateInput: Prisma.NoticeUpdateInput,
    tx: PrismaTransation = this.prisma
  ) {
    return await tx.notice.update({ data: noticeUpdateInput, where: { id } });
  }

  async update(
    noticeUpdateInput: Prisma.NoticeUpdateInput,
    query: ICrudOptionPrisma,
    tx: PrismaTransation = this.prisma
  ) {
    return await tx.notice.updateMany({
      data: noticeUpdateInput,
      where: query.where,
    });
  }

  async create(
    noticeCreateInput: Prisma.NoticeCreateInput,
    tx: PrismaTransation = this.prisma
  ): Promise<Notice> {
    return await tx.notice.create({ data: noticeCreateInput });
  }

  async amountNewNoticeByUserId(
    userId: string,
    tx: PrismaTransation = this.prisma
  ): Promise<number> {
    return await tx.notice.count({
      where: {
        userId,
        isReaded: false
      }
    });
  }


  async findOne(
    query?: ICrudOptionPrisma,
    tx: PrismaTransation = this.prisma
  ): Promise<Notice | null> {
    return await tx.notice.findFirst(query);
  }

  async findMany(
    query?: ICrudOptionPrisma,
    tx: PrismaTransation = this.prisma
  ): Promise<Notice[]> {
    return await tx.notice.findMany(query);
  }

  async deleteById(
    id: string,
    tx: PrismaTransation = this.prisma
  ): Promise<Notice> {
    return await tx.notice.delete({ where: { id } });
  }

  async deleteMany(
    noticeWhereInput: Prisma.NoticeWhereInput,
    tx: PrismaTransation = this.prisma
  ): Promise<Prisma.BatchPayload> {
    return await tx.notice.deleteMany({ where: noticeWhereInput });
  }
}
