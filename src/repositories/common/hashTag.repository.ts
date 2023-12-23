import { ICrudOptionPrisma } from "@/services/base/basePrisma.service";
import { Prisma, HashTag } from "@prisma/client";
import { BasePrismaRepository } from "../base/basePrisma.repository";


export class HashTagRepository extends BasePrismaRepository {
    constructor() {
        super()
    }


    async findAndCountAll(query?: ICrudOptionPrisma): Promise<{
        row: HashTag[];
        count: number;
    }> {
        const [row, count] = await this.prisma.$transaction([
            this.prisma.hashTag.findMany(query),
            this.prisma.hashTag.count({
                where: query?.where
            })
        ]);
        return {
            row,
            count
        }

    }

    async delete(HashTagWhereInput: Prisma.HashTagWhereInput): Promise<Prisma.BatchPayload> {
        return await this.prisma.hashTag.deleteMany({ where: HashTagWhereInput })
    }

    async updateById(id: string, hashTagUpdateInput: Prisma.HashTagUpdateInput) {
        return await this.prisma.hashTag.update({ data: hashTagUpdateInput, where: { id } })
    }

    async update(hashTagUpdateInput: Prisma.HashTagUpdateInput, query: ICrudOptionPrisma) {
        return await this.prisma.hashTag.update({ data: hashTagUpdateInput, where: query.where })
    }

  
    async create(hashTagCreateInput: Prisma.HashTagCreateInput): Promise<HashTag> {
        return await this.prisma.$transaction(async (tx) => {
            const hashTag = await tx.hashTag.create({ data: hashTagCreateInput })
            return hashTag;
        })

    }

    async findOne(query?: ICrudOptionPrisma): Promise<HashTag | null> {
        return await this.prisma.hashTag.findFirst(query)
    }


    async findMany(query?: ICrudOptionPrisma): Promise<HashTag[]> {
        return await this.prisma.hashTag.findMany(query)
    }

    async deleteById(id: string): Promise<HashTag> {
        return await this.prisma.hashTag.delete({ where: { id } })
    }

    async deleteMany(hashTagWhereInput: Prisma.HashTagWhereInput): Promise<Prisma.BatchPayload> {
        return await this.prisma.hashTag.deleteMany({ where: hashTagWhereInput })
    }

}