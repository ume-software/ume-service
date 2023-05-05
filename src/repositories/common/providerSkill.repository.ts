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


    async updateById(id: string, bookingCostUpdateInput: Prisma.BookingCostUpdateInput):Promise<ProviderSkill> {
        return await this.prisma.providerSkill.update({ data: bookingCostUpdateInput, where: { id } })
    }

    async updateMany(providerSkillUpdateInput: Prisma.ProviderSkillUpdateInput, query: ICrudOptionPrisma):Promise<Prisma.PrismaPromise<Prisma.BatchPayload>>  {
        return await this.prisma.providerSkill.updateMany({ data: providerSkillUpdateInput, where: query.where })
    }

    async create(providerSkillCreateInput: Prisma.ProviderSkillCreateInput): Promise<ProviderSkill> {
        return await this.prisma.providerSkill.create({ data: providerSkillCreateInput })
    }

    async findOne(query?: ICrudOptionPrisma): Promise<ProviderSkill | null> {
        return await this.prisma.providerSkill.findFirst(query)
    }

    async findMany(query?: ICrudOptionPrisma): Promise<ProviderSkill[]> {
        return await this.prisma.providerSkill.findMany(query)
    }

    async deleteById(id: string): Promise<ProviderSkill> {
        return await this.prisma.providerSkill.delete({ where: { id } })
    }

    async deleteMany(providerSkillWhereInput: Prisma.ProviderSkillWhereInput): Promise<Prisma.BatchPayload> {
        return await this.prisma.providerSkill.deleteMany({ where: providerSkillWhereInput })
    }
}