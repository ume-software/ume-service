import { ICrudOptionPrisma } from "@/services/base/basePrisma.service";
import {
  BasePrismaRepository,
  PrismaTransation,
} from "../base/basePrisma.repository";
import { Prisma, BookingCost } from "@prisma/client";
export class BookingCostRepository extends BasePrismaRepository {
  constructor() {
    super();
  }

  async findAndCountAll(
    query?: ICrudOptionPrisma,
    tx: PrismaTransation | any = this.prisma
  ): Promise<{
    row: BookingCost[];
    count: number;
  }> {
    const [row, count] = await tx.$transaction([
      tx.bookingCost.findMany(query),
      tx.bookingCost.count({
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
  ): Promise<BookingCost> {
    return await tx.bookingCost.update({
      data: bookingCostUpdateInput,
      where: { id },
    });
  }

  async updateMany(
    bookingCostUpdateInput: Prisma.BookingCostUpdateInput,
    query: ICrudOptionPrisma,
    tx: PrismaTransation = this.prisma
  ): Promise<Prisma.PrismaPromise<Prisma.BatchPayload>> {
    return await tx.bookingCost.updateMany({
      data: bookingCostUpdateInput,
      where: query.where,
    });
  }

  async create(
    bookingCostCreateInput: Prisma.BookingCostCreateInput,
    tx: PrismaTransation = this.prisma
  ): Promise<BookingCost> {
    return await tx.bookingCost.create({
      data: bookingCostCreateInput,
    });
  }

  async createMany(
    bookingCostCreateManyInput: Prisma.BookingCostCreateManyInput[],
    skipDuplicates = false,
    tx: PrismaTransation = this.prisma
  ) {
    return await tx.bookingCost.createMany({
      data: bookingCostCreateManyInput,
      skipDuplicates,
    });
  }

  async findOne(
    query?: ICrudOptionPrisma,
    tx: PrismaTransation = this.prisma
  ): Promise<BookingCost | null> {
    return await tx.bookingCost.findFirst(query);
  }

  async findMany(
    query?: ICrudOptionPrisma,
    tx: PrismaTransation = this.prisma
  ): Promise<BookingCost[]> {
    return await tx.bookingCost.findMany(query);
  }

  async deleteById(
    id: string,
    tx: PrismaTransation = this.prisma
  ): Promise<BookingCost> {
    return await tx.bookingCost.delete({ where: { id } });
  }

  async deleteMany(
    bookingCostWhereInput: Prisma.BookingCostWhereInput,
    tx: PrismaTransation = this.prisma
  ): Promise<Prisma.BatchPayload> {
    return await tx.bookingCost.deleteMany({
      where: bookingCostWhereInput,
    });
  }
  
}
