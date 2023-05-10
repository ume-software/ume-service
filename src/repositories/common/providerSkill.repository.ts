import { ICrudOptionPrisma } from "@/services/base/basePrisma.service";
import {
  BasePrismaRepository,
  PrismaTransation,
} from "../base/basePrisma.repository";
import { Prisma, ProviderSkill } from "@prisma/client";

export class ProviderSkillRepository extends BasePrismaRepository {
  constructor() {
    super();
  }

  async findAndCountAll(query?: ICrudOptionPrisma): Promise<{
    row: ProviderSkill[];
    count: number;
  }> {
    const [row, count] = await this.prisma.$transaction([
      this.prisma.providerSkill.findMany(query),
      this.prisma.providerSkill.count({
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
  ): Promise<ProviderSkill> {
    return await tx.providerSkill.update({
      data: bookingCostUpdateInput,
      where: { id },
    });
  }

  async updateMany(
    providerSkillUpdateInput: Prisma.ProviderSkillUpdateInput,
    query: ICrudOptionPrisma,
    tx: PrismaTransation = this.prisma
  ): Promise<Prisma.PrismaPromise<Prisma.BatchPayload>> {
    return await tx.providerSkill.updateMany({
      data: providerSkillUpdateInput,
      where: query.where,
    });
  }

  async create(
    providerSkillCreateInput: Prisma.ProviderSkillCreateInput,
    tx: PrismaTransation = this.prisma
  ): Promise<ProviderSkill> {
    return await tx.providerSkill.create({ data: providerSkillCreateInput });
  }

  async findOne(
    query?: ICrudOptionPrisma,
    tx: PrismaTransation = this.prisma
  ): Promise<ProviderSkill | null> {
    return await tx.providerSkill.findFirst(query);
  }

  async findMany(
    query?: ICrudOptionPrisma,
    tx: PrismaTransation = this.prisma
  ): Promise<ProviderSkill[]> {
    return await tx.providerSkill.findMany(query);
  }

  async deleteById(
    id: string,
    tx: PrismaTransation = this.prisma
  ): Promise<ProviderSkill> {
    return await tx.providerSkill.delete({ where: { id } });
  }

  async deleteMany(
    providerSkillWhereInput: Prisma.ProviderSkillWhereInput,
    tx: PrismaTransation = this.prisma
  ): Promise<Prisma.BatchPayload> {
    return await tx.providerSkill.deleteMany({
      where: providerSkillWhereInput,
    });
  }
}
