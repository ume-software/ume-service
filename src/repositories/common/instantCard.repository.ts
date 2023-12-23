import { ICrudOptionPrisma } from "@/services/base/basePrisma.service";
import { Prisma, InstantCard } from "@prisma/client";
import { BasePrismaRepository } from "../base/basePrisma.repository";


export class InstantCardRepository extends BasePrismaRepository {
    constructor() {
        super()
    }


    async findAndCountAll(query?: ICrudOptionPrisma): Promise<{
        row: InstantCard[];
        count: number;
    }> {
        const [row, count] = await this.prisma.$transaction([
            this.prisma.instantCard.findMany(query),
            this.prisma.instantCard.count({
                where: query?.where
            })
        ]);
        return {
            row,
            count
        }

    }

    async delete(InstantCardWhereInput: Prisma.InstantCardWhereInput): Promise<Prisma.BatchPayload> {
        return await this.prisma.instantCard.deleteMany({ where: InstantCardWhereInput })
    }

    async updateById(id: string, instantCardUpdateInput: Prisma.InstantCardUpdateInput) {
        return await this.prisma.instantCard.update({ data: instantCardUpdateInput, where: { id } })
    }

    async update(instantCardUpdateInput: Prisma.InstantCardUpdateInput, query: ICrudOptionPrisma) {
        return await this.prisma.instantCard.update({ data: instantCardUpdateInput, where: query.where })
    }

  
    async create(instantCardCreateInput: Prisma.InstantCardCreateInput): Promise<InstantCard> {
        return await this.prisma.$transaction(async (tx) => {
            const instantCard = await tx.instantCard.create({ data: instantCardCreateInput })
            return instantCard;
        })

    }

    async findOne(query?: ICrudOptionPrisma): Promise<InstantCard | null> {
        return await this.prisma.instantCard.findFirst(query)
    }


    async findMany(query?: ICrudOptionPrisma): Promise<InstantCard[]> {
        return await this.prisma.instantCard.findMany(query)
    }

    async deleteById(id: string): Promise<InstantCard> {
        return await this.prisma.instantCard.delete({ where: { id } })
    }

    async deleteMany(instantCardWhereInput: Prisma.InstantCardWhereInput): Promise<Prisma.BatchPayload> {
        return await this.prisma.instantCard.deleteMany({ where: instantCardWhereInput })
    }

}