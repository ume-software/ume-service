import { ICrudOptionPrisma } from "@/services/base/basePrisma.service";
import { BasePrismaRepository } from "../base/basePrisma.repository"
import { Prisma, Skill } from "@prisma/client";



export class SkillRepository extends BasePrismaRepository {
    constructor() {
        super()
    }


    async findAndCountAll(query?: ICrudOptionPrisma): Promise<{
        row: Skill[];
        count: number;
    }> {
        const [row, count] = await this.prisma.$transaction([
            this.prisma.skill.findMany(query),
            this.prisma.skill.count({
                where: query?.where
            })
        ]);
        return {
            row,
            count
        }

    }

    async updateById(id: string, skillUpdateInput: Prisma.SkillUpdateInput) {
        return await this.prisma.skill.update({ data: skillUpdateInput, where: { id } })
    }

    async update(skillUpdateInput: Prisma.SkillUpdateInput, query: ICrudOptionPrisma) {
        return await this.prisma.skill.update({ data: skillUpdateInput, where: query.where })
    }

    async create(skillCreateInput: Prisma.SkillCreateInput): Promise<Skill> {
        return await this.prisma.skill.create({ data: skillCreateInput })
    }

    async findOne(query?: ICrudOptionPrisma): Promise<Skill | null> {
        return await this.prisma.skill.findFirst(query)
    }

    async findMany(query?: ICrudOptionPrisma): Promise<Skill[]> {
        return await this.prisma.skill.findMany(query)
    }

    async deleteById(id: string): Promise<Skill> {
        return await this.prisma.skill.delete({ where: { id } })
    }

    async deleteMany(skillWhereInput: Prisma.SkillWhereInput): Promise<Prisma.BatchPayload> {
        return await this.prisma.skill.deleteMany({ where: skillWhereInput })
    }

}