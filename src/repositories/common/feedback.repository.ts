import { ICrudOptionPrisma } from "@/services/base/basePrisma.service";
import { BasePrismaRepository, PrismaTransation } from "../base/basePrisma.repository";
import { Prisma, Feedback } from "@prisma/client";

export class FeedbackRepository extends BasePrismaRepository {
  constructor() {
    super();
  }

  async findAndCountAll(query?: ICrudOptionPrisma): Promise<{
    row: Feedback[];
    count: number;
  }> {
    const [row, count] = await this.prisma.$transaction([
      this.prisma.feedback.findMany(query),
      this.prisma.feedback.count({
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
    bookingCostUpdateInput: Prisma.BookingCostUpdateInput,
    tx: PrismaTransation = this.prisma
  ): Promise<Feedback> {
    return await tx.feedback.update({
      data: bookingCostUpdateInput,
      where: { id },
    });
  }

  async updateMany(
    feedbackUpdateInput: Prisma.FeedbackUpdateInput,
    query: ICrudOptionPrisma,
    tx: PrismaTransation = this.prisma
  ): Promise<Prisma.PrismaPromise<Prisma.BatchPayload>> {
    return await tx.feedback.updateMany({
      data: feedbackUpdateInput,
      where: query.where,
    });
  }

  async create(
    feedbackCreateInput: Prisma.FeedbackCreateInput,
    tx: PrismaTransation = this.prisma
  ): Promise<Feedback> {
    return await tx.feedback.create({ data: feedbackCreateInput });
  }

  async findOne(
    query?: ICrudOptionPrisma,
    tx: PrismaTransation = this.prisma
  ): Promise<Feedback | null> {
    return await tx.feedback.findFirst(query);
  }

  async findMany(
    query?: ICrudOptionPrisma,
    tx: PrismaTransation = this.prisma
  ): Promise<Feedback[]> {
    return await tx.feedback.findMany(query);
  }

  async deleteById(
    id: string,
    tx: PrismaTransation = this.prisma
  ): Promise<Feedback> {
    return await tx.feedback.delete({ where: { id } });
  }

  async deleteMany(
    feedbackWhereInput: Prisma.FeedbackWhereInput,
    tx: PrismaTransation = this.prisma
  ): Promise<Prisma.BatchPayload> {
    return await tx.feedback.deleteMany({ where: feedbackWhereInput });
  }
}
