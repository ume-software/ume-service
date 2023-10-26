import { ICrudOptionPrisma } from "@/services/base/basePrisma.service";
import {
    BasePrismaRepository,
    PrismaTransaction,
} from "../base/basePrisma.repository";
import { Prisma, WithdrawRequest, WithdrawRequestStatus } from "@prisma/client";

export class WithdrawRequestRepository extends BasePrismaRepository {
    constructor() {
        super();
    }

    async findAndCountAll(query?: ICrudOptionPrisma): Promise<{
        row: WithdrawRequest[];
        count: number;
    }> {
        const [row, count] = await this.prisma.$transaction([
            this.prisma.withdrawRequest.findMany(query),
            this.prisma.withdrawRequest.count({
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
        withdrawRequestUpdateInput: Prisma.WithdrawRequestUpdateInput,
        tx: PrismaTransaction = this.prisma
    ) {
        return await tx.withdrawRequest.update({
            data: withdrawRequestUpdateInput,
            where: { id },
        });
    }

    async update(
        withdrawRequestUpdateInput: Prisma.WithdrawRequestUpdateInput,
        query: ICrudOptionPrisma,
        tx: PrismaTransaction = this.prisma
    ) {
        return await tx.withdrawRequest.update({
            data: withdrawRequestUpdateInput,
            where: query.where,
        });
    }

    async create(
        withdrawRequestCreateInput: Prisma.WithdrawRequestCreateInput,
        tx: PrismaTransaction = this.prisma
    ): Promise<WithdrawRequest> {
        return await tx.withdrawRequest.create({
            data: withdrawRequestCreateInput,
        });
    }

    async findOne(
        query?: ICrudOptionPrisma,
        tx: PrismaTransaction = this.prisma
    ): Promise<WithdrawRequest | null> {
        return await tx.withdrawRequest.findFirst(query);
    }

    async findById(
        id: string,
        tx: PrismaTransaction = this.prisma
    ): Promise<WithdrawRequest | null> {
        return await tx.withdrawRequest.findFirst({
            where: {
                id,
            },
        });
    }

    async findMany(
        query?: ICrudOptionPrisma,
        tx: PrismaTransaction = this.prisma
    ): Promise<WithdrawRequest[]> {
        return await tx.withdrawRequest.findMany(query);
    }

    async deleteById(
        id: string,
        tx: PrismaTransaction = this.prisma
    ): Promise<WithdrawRequest> {
        return await tx.withdrawRequest.delete({ where: { id } });
    }

    async deleteMany(
        withdrawRequestWhereInput: Prisma.WithdrawRequestWhereInput,
        tx: PrismaTransaction = this.prisma
    ): Promise<Prisma.BatchPayload> {
        return await tx.withdrawRequest.deleteMany({
            where: withdrawRequestWhereInput,
        });
    }

    async getTotalCoinFrozenByRequesterId(
        requesterId: string,
        tx: PrismaTransaction = this.prisma
    ): Promise<number> {
        return (
            (
                await tx.withdrawRequest.aggregate({
                    where: {
                        requesterId,
                        status: WithdrawRequestStatus.PENDING,
                    },
                    _sum: {
                        amountCoin: true,
                    },
                })
            )._sum.amountCoin || 0
        );
    }
}
