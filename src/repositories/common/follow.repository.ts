import { ICrudOptionPrisma } from "@/services/base/basePrisma.service";
import {
    BasePrismaRepository,
    PrismaTransaction,
} from "../base/basePrisma.repository";
import { Prisma, Follow } from "@prisma/client";

export class FollowRepository extends BasePrismaRepository {
    constructor() {
        super();
    }

    async findAndCountAll(query?: ICrudOptionPrisma): Promise<{
        row: Follow[];
        count: number;
    }> {
        const [row, count] = await this.prisma.$transaction([
            this.prisma.follow.findMany(query),
            this.prisma.follow.count({
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
        followUpdateInput: Prisma.FollowUpdateInput,
        tx: PrismaTransaction = this.prisma
    ) {
        return await tx.follow.update({
            data: followUpdateInput,
            where: { id },
        });
    }

    async update(
        followUpdateInput: Prisma.FollowUpdateInput,
        query: ICrudOptionPrisma,
        tx: PrismaTransaction = this.prisma
    ) {
        return await tx.follow.update({
            data: followUpdateInput,
            where: query.where,
        });
    }

    async create(
        followCreateInput: Prisma.FollowCreateInput,
        tx: PrismaTransaction = this.prisma
    ): Promise<Follow> {
        return await tx.follow.create({
            data: followCreateInput,
        });
    }

    async findOne(
        query?: ICrudOptionPrisma,
        tx: PrismaTransaction = this.prisma
    ): Promise<Follow | null> {
        return await tx.follow.findFirst(query);
    }

    async findMany(
        query?: ICrudOptionPrisma,
        tx: PrismaTransaction = this.prisma
    ): Promise<Follow[]> {
        return await tx.follow.findMany(query);
    }

    async deleteById(
        id: string,
        tx: PrismaTransaction = this.prisma
    ): Promise<Follow> {
        return await tx.follow.delete({ where: { id } });
    }

    async deleteMany(
        followWhereInput: Prisma.FollowWhereInput,
        tx: PrismaTransaction = this.prisma
    ): Promise<Prisma.BatchPayload> {
        return await tx.follow.deleteMany({
            where: followWhereInput,
        });
    }
    async destroyById(
        id: string,
        tx: PrismaTransaction = this.prisma
    ): Promise<Follow> {
        return await tx.$queryRaw`
            DELETE FROM follow
            WHERE id=${id};
        `;
    }
}
