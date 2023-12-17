import { ICrudOptionPrisma } from "@/services/base/basePrisma.service";
import {
    BasePrismaRepository,
    PrismaTransaction,
} from "../base/basePrisma.repository";
import { Prisma, BalanceHistory, BalanceType } from "@prisma/client";
import { UserBalanceResponse } from "@/common/responses";
import { bookingHistoryRepository } from "..";
import { EIntervalUnit } from "@/enums/intervalUnit.enum";

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
                    deletedAt: null,
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

    async balanceFluctuationByUserIdStatistics(
        userId: string,
        time: number = 12,
        unit: EIntervalUnit = EIntervalUnit.months,
        gapUnit: EIntervalUnit = EIntervalUnit.months
    ) {
        const generateSeries = unit == EIntervalUnit.years ? time * 12 : time;
        const interval = `${time} ${unit}`;
        return await this.prisma.$queryRawUnsafe(`
    
            WITH statistic_month AS (
                SELECT date_trunc('${gapUnit}', CURRENT_DATE - INTERVAL '${interval}' + (n || ' ${gapUnit}')::interval) AS time
                FROM generate_series(0, ${generateSeries}) n
            ),
            balance_history_user AS (
                SELECT 
                    bh.user_id AS user_id,
                    DATE_TRUNC('${gapUnit}', bh.created_at) AS created_at,
                    bh.amount AS amount
                FROM 
                    balance_history bh
                where 
                    bh.user_id = '${userId}'
            )
            SELECT 
                COALESCE(SUM(CASE WHEN bhu.amount < 0 THEN bhu.amount ELSE 0 END), 0) AS expenses,
                COALESCE(SUM(CASE WHEN bhu.amount > 0 THEN bhu.amount ELSE 0 END), 0) AS income,
                sm.time AS time
            FROM 
                statistic_month sm
            LEFT JOIN 
                balance_history_user bhu ON sm.time = bhu.created_at
            GROUP BY 
                sm.time
            ORDER BY 
                sm.time;
    `);
    }
}
