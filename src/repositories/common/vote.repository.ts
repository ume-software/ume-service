import { ICrudOptionPrisma } from "@/services/base/basePrisma.service";
import { BasePrismaRepository, PrismaTransation } from "../base/basePrisma.repository";
import { Prisma, Vote } from "@prisma/client";

export class VoteRepository extends BasePrismaRepository {
  constructor() {
    super();
  }

  async findAndCountAll(query?: ICrudOptionPrisma): Promise<{
    row: Vote[];
    count: number;
  }> {
    const [row, count] = await this.prisma.$transaction([
      this.prisma.vote.findMany(query),
      this.prisma.vote.count({
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
  ): Promise<Vote> {
    return await tx.vote.update({
      data: bookingCostUpdateInput,
      where: { id },
    });
  }

  async updateMany(
    voteUpdateInput: Prisma.VoteUpdateInput,
    query: ICrudOptionPrisma,
    tx: PrismaTransation = this.prisma
  ): Promise<Prisma.PrismaPromise<Prisma.BatchPayload>> {
    return await tx.vote.updateMany({
      data: voteUpdateInput,
      where: query.where,
    });
  }

  async create(
    voteCreateInput: Prisma.VoteCreateInput,
    tx: PrismaTransation = this.prisma
  ): Promise<Vote> {
    return await tx.vote.create({ data: voteCreateInput });
  }

  async findOne(
    query?: ICrudOptionPrisma,
    tx: PrismaTransation = this.prisma
  ): Promise<Vote | null> {
    return await tx.vote.findFirst(query);
  }

  async findMany(
    query?: ICrudOptionPrisma,
    tx: PrismaTransation = this.prisma
  ): Promise<Vote[]> {
    return await tx.vote.findMany(query);
  }

  async deleteById(
    id: string,
    tx: PrismaTransation = this.prisma
  ): Promise<Vote> {
    return await tx.vote.delete({ where: { id } });
  }

  async deleteMany(
    voteWhereInput: Prisma.VoteWhereInput,
    tx: PrismaTransation = this.prisma
  ): Promise<Prisma.BatchPayload> {
    return await tx.vote.deleteMany({ where: voteWhereInput });
  }
}
