import { ICrudOptionPrisma } from "@/services/base/basePrisma.service";
import {
    BasePrismaRepository,
    PrismaTransaction,
} from "../base/basePrisma.repository";
import { Prisma, BalanceHistory, BalanceType } from "@prisma/client";
import { UserBalanceResponse } from "@/common/responses";
import { bookingHistoryRepository } from "..";

export class BalanceHistoryRepository extends BasePrismaRepository {
    constructor() {
        super();
    }
    async countByUserIdAndBalanceType(
        userId: string,
        balanceTypes: BalanceType[] = [],
        tx: PrismaTransaction = this.prisma
    ): Promise<number | null> {
        return (
            await tx.balanceHistory.aggregate({
                where: {
                    userId,
                    balanceType: {
                        in: balanceTypes,
                    },
                },
                _sum: {
                    amount: true,
                },
            })
        )._sum.amount;
    }
    async findAndCountAll(query?: ICrudOptionPrisma): Promise<{
        row: BalanceHistory[];
        count: number;
    }> {
        const [row, count] = await this.prisma.$transaction([
            this.prisma.balanceHistory.findMany(query),
            this.prisma.balanceHistory.count({
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
        bookingCostUpdateInput: Prisma.BookingCostUpdateInput,
        tx: PrismaTransaction = this.prisma
    ): Promise<BalanceHistory> {
        return await tx.balanceHistory.update({
            data: bookingCostUpdateInput,
            where: { id },
        });
    }

    async updateMany(
        BalanceHistoryUpdateInput: Prisma.BalanceHistoryUpdateInput,
        query: ICrudOptionPrisma,
        tx: PrismaTransaction = this.prisma
    ): Promise<Prisma.PrismaPromise<Prisma.BatchPayload>> {
        return await tx.balanceHistory.updateMany({
            data: BalanceHistoryUpdateInput,
            where: query.where,
        });
    }

    async create(
        balanceHistoryCreateInput: Prisma.BalanceHistoryCreateInput,
        tx: PrismaTransaction = this.prisma
    ): Promise<BalanceHistory> {
        return await tx.balanceHistory.create({
            data: balanceHistoryCreateInput,
        });
    }

    async findOne(
        query?: ICrudOptionPrisma,
        tx: PrismaTransaction = this.prisma
    ): Promise<BalanceHistory | null> {
        return await tx.balanceHistory.findFirst(query);
    }

    async findMany(
        query?: ICrudOptionPrisma,
        tx: PrismaTransaction = this.prisma
    ): Promise<BalanceHistory[]> {
        return await tx.balanceHistory.findMany(query);
    }

    async deleteById(
        id: string,
        tx: PrismaTransaction = this.prisma
    ): Promise<BalanceHistory> {
        return await tx.balanceHistory.delete({ where: { id } });
    }

    async deleteMany(
        balanceHistoryWhereInput: Prisma.BalanceHistoryWhereInput,
        tx: PrismaTransaction = this.prisma
    ): Promise<Prisma.BatchPayload> {
        return await tx.balanceHistory.deleteMany({
            where: balanceHistoryWhereInput,
        });
    }

    async getTotalBalanceByUserId(
        userId: string
    ): Promise<UserBalanceResponse> {
        const totalBalance = await this.getTotalBalanceUser(userId);
        const getTotalBalanceFrozen =
            await bookingHistoryRepository.getTotalBalanceFrozenByBookerId(
                userId
            );
        return {
            userId: userId,
            totalBalanceAvailable: totalBalance - getTotalBalanceFrozen,
            totalBalance,
        };
    }
    async getTotalBalanceUser(userId: string) {
        return (
            (await this.countByUserIdAndBalanceType(
                userId,
                Object.values(BalanceType)
            )) || 0
        );
    }
}
