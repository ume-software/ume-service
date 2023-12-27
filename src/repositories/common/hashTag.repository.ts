import { ICrudOptionPrisma } from "@/services/base/basePrisma.service";
import { Prisma, HashTag } from "@prisma/client";
import {
    BasePrismaRepository,
    PrismaTransaction,
} from "../base/basePrisma.repository";

export class HashTagRepository extends BasePrismaRepository {
    constructor() {
        super();
    }

    async findAndCountAll(query?: ICrudOptionPrisma): Promise<{
        row: HashTag[];
        count: number;
    }> {
        const [row, count] = await this.prisma.$transaction([
            this.prisma.hashTag.findMany(query),
            this.prisma.hashTag.count({
                where: query?.where,
            }),
        ]);
        return {
            row,
            count,
        };
    }

    async delete(
        HashTagWhereInput: Prisma.HashTagWhereInput,
        tx: PrismaTransaction = this.prisma
    ): Promise<Prisma.BatchPayload> {
        return await tx.hashTag.deleteMany({
            where: HashTagWhereInput,
        });
    }

    async updateById(
        id: string,
        hashTagUpdateInput: Prisma.HashTagUpdateInput,
        tx: PrismaTransaction = this.prisma
    ) {
        return await tx.hashTag.update({
            data: hashTagUpdateInput,
            where: { id },
        });
    }

    async update(
        hashTagUpdateInput: Prisma.HashTagUpdateInput,
        query: ICrudOptionPrisma,
        tx: PrismaTransaction = this.prisma
    ) {
        return await tx.hashTag.update({
            data: hashTagUpdateInput,
            where: query.where,
        });
    }

    async create(
        hashTagCreateInput: Prisma.HashTagCreateInput,
        tx: PrismaTransaction = this.prisma
    ): Promise<HashTag> {
        return await tx.hashTag.create({
            data: hashTagCreateInput,
        });
    }

    async findOne(
        query?: ICrudOptionPrisma,
        tx: PrismaTransaction = this.prisma
    ): Promise<HashTag | null> {
        return await tx.hashTag.findFirst(query);
    }

    async findMany(
        query?: ICrudOptionPrisma,
        tx: PrismaTransaction = this.prisma
    ): Promise<HashTag[]> {
        return await tx.hashTag.findMany(query);
    }

    async deleteById(
        id: string,
        tx: PrismaTransaction = this.prisma
    ): Promise<HashTag> {
        return await tx.hashTag.delete({ where: { id } });
    }

    async deleteMany(
        hashTagWhereInput: Prisma.HashTagWhereInput,
        tx: PrismaTransaction = this.prisma
    ): Promise<Prisma.BatchPayload> {
        return await tx.hashTag.deleteMany({
            where: hashTagWhereInput,
        });
    }
}
