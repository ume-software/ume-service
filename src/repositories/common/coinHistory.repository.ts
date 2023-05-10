import { ICrudOptionPrisma } from "@/services/base/basePrisma.service";
import {
  BasePrismaRepository,
  PrismaTransation,
} from "../base/basePrisma.repository";
import { Prisma, CoinHistory } from "@prisma/client";

export class CoinHistoryRepository extends BasePrismaRepository {
  constructor() {
    super();
  }

  async findAndCountAll(query?: ICrudOptionPrisma): Promise<{
    row: CoinHistory[];
    count: number;
  }> {
    const [row, count] = await this.prisma.$transaction([
      this.prisma.coinHistory.findMany(query),
      this.prisma.coinHistory.count({
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
  ): Promise<CoinHistory> {
    return await tx.coinHistory.update({
      data: bookingCostUpdateInput,
      where: { id },
    });
  }

  async updateMany(
    CoinHistoryUpdateInput: Prisma.CoinHistoryUpdateInput,
    query: ICrudOptionPrisma,
    tx: PrismaTransation = this.prisma
  ): Promise<Prisma.PrismaPromise<Prisma.BatchPayload>> {
    return await tx.coinHistory.updateMany({
      data: CoinHistoryUpdateInput,
      where: query.where,
    });
  }

  async create(
    coinHistoryCreateInput: Prisma.CoinHistoryCreateInput,
    tx: PrismaTransation = this.prisma
  ): Promise<CoinHistory> {
    return await tx.coinHistory.create({ data: coinHistoryCreateInput });
  }

  async findOne(
    query?: ICrudOptionPrisma,
    tx: PrismaTransation = this.prisma
  ): Promise<CoinHistory | null> {
    return await tx.coinHistory.findFirst(query);
  }

  async findMany(
    query?: ICrudOptionPrisma,
    tx: PrismaTransation = this.prisma
  ): Promise<CoinHistory[]> {
    return await tx.coinHistory.findMany(query);
  }

  async deleteById(
    id: string,
    tx: PrismaTransation = this.prisma
  ): Promise<CoinHistory> {
    return await tx.coinHistory.delete({ where: { id } });
  }

  async deleteMany(
    coinHistoryWhereInput: Prisma.CoinHistoryWhereInput,
    tx: PrismaTransation = this.prisma
  ): Promise<Prisma.BatchPayload> {
    return await tx.coinHistory.deleteMany({ where: coinHistoryWhereInput });
  }
}
