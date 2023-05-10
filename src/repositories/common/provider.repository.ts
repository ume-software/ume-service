import { ICrudOptionPrisma } from "@/services/base/basePrisma.service";
import { BasePrismaRepository, PrismaTransation } from "../base/basePrisma.repository";
import { Prisma, Provider } from "@prisma/client";

export class ProviderRepository extends BasePrismaRepository {
  constructor() {
    super();
  }

  async findAndCountAll(query?: ICrudOptionPrisma): Promise<{
    row: Provider[];
    count: number;
  }> {
    const [row, count] = await this.prisma.$transaction([
      this.prisma.provider.findMany(query),
      this.prisma.provider.count({
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
  ): Promise<Provider> {
    return await tx.provider.update({
      data: bookingCostUpdateInput,
      where: { id },
    });
  }

  async updateMany(
    providerUpdateInput: Prisma.ProviderUpdateInput,
    query: ICrudOptionPrisma,
    tx: PrismaTransation = this.prisma
  ): Promise<Prisma.PrismaPromise<Prisma.BatchPayload>> {
    return await tx.provider.updateMany({
      data: providerUpdateInput,
      where: query.where,
    });
  }

  async create(
    providerCreateInput: Prisma.ProviderCreateInput,
    tx: PrismaTransation = this.prisma
  ): Promise<Provider> {
    return await tx.provider.create({ data: providerCreateInput });
  }

  async findOne(
    query?: ICrudOptionPrisma,
    tx: PrismaTransation = this.prisma
  ): Promise<Provider | null> {
    return await tx.provider.findFirst(query);
  }

  async findMany(
    query?: ICrudOptionPrisma,
    tx: PrismaTransation = this.prisma
  ): Promise<Provider[]> {
    return await tx.provider.findMany(query);
  }

  async deleteById(
    id: string,
    tx: PrismaTransation = this.prisma
  ): Promise<Provider> {
    return await tx.provider.delete({ where: { id } });
  }

  async deleteMany(
    providerWhereInput: Prisma.ProviderWhereInput,
    tx: PrismaTransation = this.prisma
  ): Promise<Prisma.BatchPayload> {
    return await tx.provider.deleteMany({ where: providerWhereInput });
  }
}
