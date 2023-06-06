import { ICrudOptionPrisma } from "@/services/base/basePrisma.service";
import {
  BasePrismaRepository,
  PrismaTransation,
} from "../base/basePrisma.repository";
import { Prisma, BuyCoinRequest } from "@prisma/client";


export class BuyCoinRequestRepository extends BasePrismaRepository {
  constructor() {
    super();
  }

  async findAndCountAll(query?: ICrudOptionPrisma): Promise<{
    row: BuyCoinRequest[];
    count: number;
  }> {
    const [row, count] = await this.prisma.$transaction([
      this.prisma.buyCoinRequest.findMany(query),
      this.prisma.buyCoinRequest.count({
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
    buyCoinRequestUpdateInput: Prisma.BuyCoinRequestUpdateInput,
    tx: PrismaTransation = this.prisma
  ) {
    return await tx.buyCoinRequest.update({ data: buyCoinRequestUpdateInput, where: { id } });
  }

  async update(
    buyCoinRequestUpdateInput: Prisma.BuyCoinRequestUpdateInput,
    query: ICrudOptionPrisma,
    tx: PrismaTransation = this.prisma
  ) {
    return await tx.buyCoinRequest.update({
      data: buyCoinRequestUpdateInput,
      where: query.where,
    });
  }

  async create(
    BuyCoinRequestCreateInput: Prisma.BuyCoinRequestCreateInput,
    tx: PrismaTransation = this.prisma
  ): Promise<BuyCoinRequest> {
    return await tx.buyCoinRequest.create({ data: BuyCoinRequestCreateInput });
  }

  async findOne(
    query?: ICrudOptionPrisma,
    tx: PrismaTransation = this.prisma
  ): Promise<BuyCoinRequest | null> {
    return await tx.buyCoinRequest.findFirst(query);
  }

  async findById(
    id: string,
    tx: PrismaTransation = this.prisma
  ): Promise<BuyCoinRequest | null> {

    return await tx.buyCoinRequest.findFirst({
      where: {
        id
      }
    });
  }

  async findMany(
    query?: ICrudOptionPrisma,
    tx: PrismaTransation = this.prisma
  ): Promise<BuyCoinRequest[]> {
    return await tx.buyCoinRequest.findMany(query);
  }

  async deleteById(
    id: string,
    tx: PrismaTransation = this.prisma
  ): Promise<BuyCoinRequest> {
    return await tx.buyCoinRequest.delete({ where: { id } });
  }

  async deleteMany(
    buyCoinRequestWhereInput: Prisma.BuyCoinRequestWhereInput,
    tx: PrismaTransation = this.prisma
  ): Promise<Prisma.BatchPayload> {
    return await tx.buyCoinRequest.deleteMany({ where: buyCoinRequestWhereInput });
  }
}
