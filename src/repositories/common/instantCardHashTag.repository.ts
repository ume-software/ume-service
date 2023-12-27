import { ICrudOptionPrisma } from "@/services/base/basePrisma.service";
import { Prisma, InstantCardHashTag } from "@prisma/client";
import {
    BasePrismaRepository,
    PrismaTransaction,
} from "../base/basePrisma.repository";

export class InstantCardHashTagRepository extends BasePrismaRepository {
    constructor() {
        super();
    }

    async findAndCountAll(query?: ICrudOptionPrisma): Promise<{
        row: InstantCardHashTag[];
        count: number;
    }> {
        const [row, count] = await this.prisma.$transaction([
            this.prisma.instantCardHashTag.findMany(query),
            this.prisma.instantCardHashTag.count({
                where: query?.where,
            }),
        ]);
        return {
            row,
            count,
        };
    }

    async delete(
        InstantCardHashTagWhereInput: Prisma.InstantCardHashTagWhereInput,
        tx: PrismaTransaction = this.prisma
    ): Promise<Prisma.BatchPayload> {
        return await tx.instantCardHashTag.deleteMany({
            where: InstantCardHashTagWhereInput,
        });
    }

    async updateById(
        id: string,
        instantCardHashTagUpdateInput: Prisma.InstantCardHashTagUpdateInput,
        tx: PrismaTransaction = this.prisma
    ) {
        return await tx.instantCardHashTag.update({
            data: instantCardHashTagUpdateInput,
            where: { id },
        });
    }

    async update(
        instantCardHashTagUpdateInput: Prisma.InstantCardHashTagUpdateInput,
        query: ICrudOptionPrisma,
        tx: PrismaTransaction = this.prisma
    ) {
        return await tx.instantCardHashTag.update({
            data: instantCardHashTagUpdateInput,
            where: query.where,
        });
    }

    async create(
        instantCardHashTagCreateInput: Prisma.InstantCardHashTagCreateInput,
        tx: PrismaTransaction = this.prisma
    ): Promise<InstantCardHashTag> {
        return await tx.instantCardHashTag.create({
            data: instantCardHashTagCreateInput,
        });
    }

    async findOne(
        query?: ICrudOptionPrisma,
        tx: PrismaTransaction = this.prisma
    ): Promise<InstantCardHashTag | null> {
        return await tx.instantCardHashTag.findFirst(query);
    }

    async findMany(
        query?: ICrudOptionPrisma,
        tx: PrismaTransaction = this.prisma
    ): Promise<InstantCardHashTag[]> {
        return await tx.instantCardHashTag.findMany(query);
    }

    async deleteById(
        id: string,
        tx: PrismaTransaction = this.prisma
    ): Promise<InstantCardHashTag> {
        return await tx.instantCardHashTag.delete({ where: { id } });
    }

    async deleteMany(
        instantCardHashTagWhereInput: Prisma.InstantCardHashTagWhereInput,
        tx: PrismaTransaction = this.prisma
    ): Promise<Prisma.BatchPayload> {
        return await tx.instantCardHashTag.deleteMany({
            where: instantCardHashTagWhereInput,
        });
    }
}
