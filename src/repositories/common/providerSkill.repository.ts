import { ICrudOptionPrisma } from "@/services/base/basePrisma.service";
import { BasePrismaRepository } from "../base/basePrisma.repository"
import { Prisma, ProviderSkill } from "@prisma/client";



export class ProviderSkillRepository extends BasePrismaRepository {
    constructor() {
        super()
    }


    async findAndCountAll(query?: ICrudOptionPrisma): Promise<{
        row: ProviderSkill[];
        count: number;
    }> {
        const [row, count] = await this.prisma.$transaction([
            this.prisma.providerSkill.findMany(query),
            this.prisma.providerSkill.count({
                where: query?.where
            })
        ]);
        return {
            row,
            count
        }

    }
    async create(providerSkillCreateInput: Prisma.ProviderSkillCreateInput): Promise<ProviderSkill> {
        return await this.prisma.providerSkill.create({ data: providerSkillCreateInput })
    }

    async findOne(query?: ICrudOptionPrisma): Promise<ProviderSkill | null> {
        return await this.prisma.providerSkill.findFirst(query)
    }

    async delete(providerSkillWhereInput: Prisma.ProviderSkillWhereInput): Promise<Prisma.BatchPayload> {
        return await this.prisma.providerSkill.deleteMany({ where: providerSkillWhereInput })
    }

}