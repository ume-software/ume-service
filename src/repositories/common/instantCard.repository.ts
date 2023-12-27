import { ICrudOptionPrisma } from "@/services/base/basePrisma.service";
import { Prisma, InstantCard } from "@prisma/client";
import {
    BasePrismaRepository,
    PrismaTransaction,
} from "../base/basePrisma.repository";

export class InstantCardRepository extends BasePrismaRepository {
    constructor() {
        super();
    }

    async findAndCountAll(query?: ICrudOptionPrisma): Promise<{
        row: InstantCard[];
        count: number;
    }> {
        const [row, count] = await this.prisma.$transaction([
            this.prisma.instantCard.findMany(query),
            this.prisma.instantCard.count({
                where: query?.where,
            }),
        ]);
        return {
            row,
            count,
        };
    }

    async delete(
        InstantCardWhereInput: Prisma.InstantCardWhereInput,
        tx: PrismaTransaction = this.prisma
    ): Promise<Prisma.BatchPayload> {
        return await tx.instantCard.deleteMany({
            where: InstantCardWhereInput,
        });
    }

    async updateById(
        id: string,
        instantCardUpdateInput: Prisma.InstantCardUpdateInput,
        tx: PrismaTransaction = this.prisma
    ) {
        return await tx.instantCard.update({
            data: instantCardUpdateInput,
            where: { id },
        });
    }

    async update(
        instantCardUpdateInput: Prisma.InstantCardUpdateInput,
        query: ICrudOptionPrisma,
        tx: PrismaTransaction = this.prisma
    ) {
        return await tx.instantCard.update({
            data: instantCardUpdateInput,
            where: query.where,
        });
    }

    async create(
        instantCardCreateInput: Prisma.InstantCardCreateInput,
        tx: PrismaTransaction = this.prisma
    ): Promise<InstantCard> {
        return await tx.instantCard.create({
            data: instantCardCreateInput,
        });
    }

    async findOne(
        query?: ICrudOptionPrisma,
        tx: PrismaTransaction = this.prisma
    ): Promise<InstantCard | null> {
        return await tx.instantCard.findFirst(query);
    }

    async findMany(
        query?: ICrudOptionPrisma,
        tx: PrismaTransaction = this.prisma
    ): Promise<InstantCard[]> {
        return await tx.instantCard.findMany(query);
    }

    async deleteById(
        id: string,
        tx: PrismaTransaction = this.prisma
    ): Promise<InstantCard> {
        return await tx.instantCard.delete({ where: { id } });
    }

    async deleteMany(
        instantCardWhereInput: Prisma.InstantCardWhereInput,
        tx: PrismaTransaction = this.prisma
    ): Promise<Prisma.BatchPayload> {
        return await tx.instantCard.deleteMany({
            where: instantCardWhereInput,
        });
    }
}
