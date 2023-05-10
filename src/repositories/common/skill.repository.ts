import { ICrudOptionPrisma } from "@/services/base/basePrisma.service";
import {
  BasePrismaRepository,
  PrismaTransation,
} from "../base/basePrisma.repository";
import { Prisma, Skill } from "@prisma/client";

export class SkillRepository extends BasePrismaRepository {
  constructor() {
    super();
  }

  async findAndCountAll(query?: ICrudOptionPrisma): Promise<{
    row: Skill[];
    count: number;
  }> {
    const [row, count] = await this.prisma.$transaction([
      this.prisma.skill.findMany(query),
      this.prisma.skill.count({
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
    skillUpdateInput: Prisma.SkillUpdateInput,
    tx: PrismaTransation = this.prisma
  ) {
    return await tx.skill.update({ data: skillUpdateInput, where: { id } });
  }

  async update(
    skillUpdateInput: Prisma.SkillUpdateInput,
    query: ICrudOptionPrisma,
    tx: PrismaTransation = this.prisma
  ) {
    return await tx.skill.update({
      data: skillUpdateInput,
      where: query.where,
    });
  }

  async create(
    skillCreateInput: Prisma.SkillCreateInput,
    tx: PrismaTransation = this.prisma
  ): Promise<Skill> {
    return await tx.skill.create({ data: skillCreateInput });
  }

  async findOne(
    query?: ICrudOptionPrisma,
    tx: PrismaTransation = this.prisma
  ): Promise<Skill | null> {
    return await tx.skill.findFirst(query);
  }

  async findMany(
    query?: ICrudOptionPrisma,
    tx: PrismaTransation = this.prisma
  ): Promise<Skill[]> {
    return await tx.skill.findMany(query);
  }

  async deleteById(
    id: string,
    tx: PrismaTransation = this.prisma
  ): Promise<Skill> {
    return await tx.skill.delete({ where: { id } });
  }

  async deleteMany(
    skillWhereInput: Prisma.SkillWhereInput,
    tx: PrismaTransation = this.prisma
  ): Promise<Prisma.BatchPayload> {
    return await tx.skill.deleteMany({ where: skillWhereInput });
  }
}
