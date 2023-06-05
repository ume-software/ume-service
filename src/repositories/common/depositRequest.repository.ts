import { ICrudOptionPrisma } from "@/services/base/basePrisma.service";
import {
  BasePrismaRepository,
  PrismaTransation,
} from "../base/basePrisma.repository";
import { Prisma, DepositRequest } from "@prisma/client";

export class DepositRequestRepository extends BasePrismaRepository {
  constructor() {
    super();
  }

  async findAndCountAll(query?: ICrudOptionPrisma): Promise<{
    row: DepositRequest[];
    count: number;
  }> {
    const [row, count] = await this.prisma.$transaction([
      this.prisma.depositRequest.findMany(query),
      this.prisma.depositRequest.count({
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
    depositRequestUpdateInput: Prisma.DepositRequestUpdateInput,
    tx: PrismaTransation = this.prisma
  ) {
    return await tx.depositRequest.update({ data: depositRequestUpdateInput, where: { id } });
  }

  async update(
    depositRequestUpdateInput: Prisma.DepositRequestUpdateInput,
    query: ICrudOptionPrisma,
    tx: PrismaTransation = this.prisma
  ) {
    return await tx.depositRequest.update({
      data: depositRequestUpdateInput,
      where: query.where,
    });
  }

  async create(
    depositRequestCreateInput: Prisma.DepositRequestCreateInput,
    tx: PrismaTransation = this.prisma
  ): Promise<DepositRequest> {
    return await tx.depositRequest.create({ data: depositRequestCreateInput });
  }

  async findOne(
    query?: ICrudOptionPrisma,
    tx: PrismaTransation = this.prisma
  ): Promise<DepositRequest | null> {
    return await tx.depositRequest.findFirst(query);
  }

  async findMany(
    query?: ICrudOptionPrisma,
    tx: PrismaTransation = this.prisma
  ): Promise<DepositRequest[]> {
    return await tx.depositRequest.findMany(query);
  }

  async deleteById(
    id: string,
    tx: PrismaTransation = this.prisma
  ): Promise<DepositRequest> {
    return await tx.depositRequest.delete({ where: { id } });
  }

  async deleteMany(
    depositRequestWhereInput: Prisma.DepositRequestWhereInput,
    tx: PrismaTransation = this.prisma
  ): Promise<Prisma.BatchPayload> {
    return await tx.depositRequest.deleteMany({ where: depositRequestWhereInput });
  }
}
