import { ICrudOptionPrisma } from "@/services/base/basePrisma.service";
import { BasePrismaRepository, PrismaTransaction } from "../base/basePrisma.repository";
import { Prisma, Feedback, BookingHistory } from "@prisma/client";

export class FeedbackRepository extends BasePrismaRepository {
  constructor() {
    super();
  }

  async findAndCountAll(query?: ICrudOptionPrisma): Promise<{
    row: (Feedback & {
      booking?: BookingHistory;
    })[];
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
    tx: PrismaTransaction = this.prisma
  ): Promise<(Feedback & {
    booking?: BookingHistory;
  })> {
    return await tx.feedback.update({
      data: bookingCostUpdateInput,
      where: { id },
    });
  }

  async updateMany(
    feedbackUpdateInput: Prisma.FeedbackUpdateInput,
    query: ICrudOptionPrisma,
    tx: PrismaTransaction = this.prisma
  ): Promise<Prisma.PrismaPromise<Prisma.BatchPayload>> {
    return await tx.feedback.updateMany({
      data: feedbackUpdateInput,
      where: query.where,
    });
  }

  async create(
    feedbackCreateInput: Prisma.FeedbackCreateInput,
    tx: PrismaTransaction = this.prisma
  ): Promise<(Feedback & {
    booking?: BookingHistory;
  })> {
    return await tx.feedback.create({ data: feedbackCreateInput });
  }

  async findOne(
    query?: ICrudOptionPrisma,
    tx: PrismaTransaction = this.prisma
  ): Promise<(Feedback & {
    booking?: BookingHistory;
  }) | null> {
    return await tx.feedback.findFirst(query);
  }

  async findMany(
    query?: ICrudOptionPrisma,
    tx: PrismaTransaction = this.prisma
  ): Promise<(Feedback & {
    booking?: BookingHistory;
  })[]> {
    return await tx.feedback.findMany(query);
  }

  async deleteById(
    id: string,
    tx: PrismaTransaction = this.prisma
  ): Promise<(Feedback & {
    booking?: BookingHistory;
  })> {
    return await tx.feedback.delete({ where: { id } });
  }

  async deleteMany(
    feedbackWhereInput: Prisma.FeedbackWhereInput,
    tx: PrismaTransaction = this.prisma
  ): Promise<Prisma.BatchPayload> {
    return await tx.feedback.deleteMany({ where: feedbackWhereInput });
  }



  async getByListByProviderServiceId(providerServiceId: string) {
    const [row, count] = await this.prisma.$transaction([
      this.prisma.feedback.findMany({
        where: {
          booking: {
            providerServiceId
          }
        }
      }),
      this.prisma.feedback.findMany({
        where: {
          booking: {
            providerServiceId
          }
        }
      })
    ]);
    return {
      row,
      count,
    };
  }
}
