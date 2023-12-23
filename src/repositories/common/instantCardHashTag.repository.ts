import { ICrudOptionPrisma } from "@/services/base/basePrisma.service";
import { Prisma, InstantCardHashTag } from "@prisma/client";
import { BasePrismaRepository } from "../base/basePrisma.repository";


export class InstantCardHashTagRepository extends BasePrismaRepository {
    constructor() {
        super()
    }


    async findAndCountAll(query?: ICrudOptionPrisma): Promise<{
        row: InstantCardHashTag[];
        count: number;
    }> {
        const [row, count] = await this.prisma.$transaction([
            this.prisma.instantCardHashTag.findMany(query),
            this.prisma.instantCardHashTag.count({
                where: query?.where
            })
        ]);
        return {
            row,
            count
        }

    }

    async delete(InstantCardHashTagWhereInput: Prisma.InstantCardHashTagWhereInput): Promise<Prisma.BatchPayload> {
        return await this.prisma.instantCardHashTag.deleteMany({ where: InstantCardHashTagWhereInput })
    }

    async updateById(id: string, instantCardHashTagUpdateInput: Prisma.InstantCardHashTagUpdateInput) {
        return await this.prisma.instantCardHashTag.update({ data: instantCardHashTagUpdateInput, where: { id } })
    }

    async update(instantCardHashTagUpdateInput: Prisma.InstantCardHashTagUpdateInput, query: ICrudOptionPrisma) {
        return await this.prisma.instantCardHashTag.update({ data: instantCardHashTagUpdateInput, where: query.where })
    }

  
    async create(instantCardHashTagCreateInput: Prisma.InstantCardHashTagCreateInput): Promise<InstantCardHashTag> {
        return await this.prisma.$transaction(async (tx) => {
            const instantCardHashTag = await tx.instantCardHashTag.create({ data: instantCardHashTagCreateInput })
            return instantCardHashTag;
        })

    }

    async findOne(query?: ICrudOptionPrisma): Promise<InstantCardHashTag | null> {
        return await this.prisma.instantCardHashTag.findFirst(query)
    }


    async findMany(query?: ICrudOptionPrisma): Promise<InstantCardHashTag[]> {
        return await this.prisma.instantCardHashTag.findMany(query)
    }

    async deleteById(id: string): Promise<InstantCardHashTag> {
        return await this.prisma.instantCardHashTag.delete({ where: { id } })
    }

    async deleteMany(instantCardHashTagWhereInput: Prisma.InstantCardHashTagWhereInput): Promise<Prisma.BatchPayload> {
        return await this.prisma.instantCardHashTag.deleteMany({ where: instantCardHashTagWhereInput })
    }

}