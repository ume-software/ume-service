import { ICrudOptionPrisma } from "@/services/base/basePrisma.service";
import {
    BasePrismaRepository,
    PrismaTransaction,
} from "../base/basePrisma.repository";
import {
    Prisma,
    WithdrawalRequest,
    WithdrawalRequestStatus,
} from "@prisma/client";
import { EIntervalUnit } from "@/enums/intervalUnit.enum";

export class WithdrawalRequestRepository extends BasePrismaRepository {
    constructor() {
        super();
    }

    async findAndCountAll(query?: ICrudOptionPrisma): Promise<{
        row: WithdrawalRequest[];
        count: number;
    }> {
        const [row, count] = await this.prisma.$transaction([
            this.prisma.withdrawalRequest.findMany(query),
            this.prisma.withdrawalRequest.count({
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
        withdrawalRequestUpdateInput: Prisma.WithdrawalRequestUpdateInput,
        tx: PrismaTransaction = this.prisma
    ) {
        return await tx.withdrawalRequest.update({
            data: withdrawalRequestUpdateInput,
            where: { id },
        });
    }

    async update(
        withdrawalRequestUpdateInput: Prisma.WithdrawalRequestUpdateInput,
        query: ICrudOptionPrisma,
        tx: PrismaTransaction = this.prisma
    ) {
        return await tx.withdrawalRequest.update({
            data: withdrawalRequestUpdateInput,
            where: query.where,
        });
    }

    async create(
        withdrawalRequestCreateInput: Prisma.WithdrawalRequestCreateInput,
        tx: PrismaTransaction = this.prisma
    ): Promise<WithdrawalRequest> {
        return await tx.withdrawalRequest.create({
            data: withdrawalRequestCreateInput,
        });
    }

    async findOne(
        query?: ICrudOptionPrisma,
        tx: PrismaTransaction = this.prisma
    ): Promise<WithdrawalRequest | null> {
        return await tx.withdrawalRequest.findFirst(query);
    }

    async findById(
        id: string,
        tx: PrismaTransaction = this.prisma
    ): Promise<WithdrawalRequest | null> {
        return await tx.withdrawalRequest.findFirst({
            where: {
                id,
            },
        });
    }

    async findMany(
        query?: ICrudOptionPrisma,
        tx: PrismaTransaction = this.prisma
    ): Promise<WithdrawalRequest[]> {
        return await tx.withdrawalRequest.findMany(query);
    }

    async deleteById(
        id: string,
        tx: PrismaTransaction = this.prisma
    ): Promise<WithdrawalRequest> {
        return await tx.withdrawalRequest.delete({ where: { id } });
    }

    async deleteMany(
        withdrawalRequestWhereInput: Prisma.WithdrawalRequestWhereInput,
        tx: PrismaTransaction = this.prisma
    ): Promise<Prisma.BatchPayload> {
        return await tx.withdrawalRequest.deleteMany({
            where: withdrawalRequestWhereInput,
        });
    }

    async getTotalAmountMoney(where: Prisma.WithdrawalRequestWhereInput) {
        return (
            (
                await this.prisma.withdrawalRequest.aggregate({
                    where,
                    _sum: {
                        amountMoney: true,
                    },
                })
            )._sum.amountMoney || 0
        );
    }
    async getTotalBalanceFrozenByRequesterId(
        requesterId: string,
        tx: PrismaTransaction = this.prisma
    ): Promise<number> {
        return (
            (
                await tx.withdrawalRequest.aggregate({
                    where: {
                        requesterId,
                        status: WithdrawalRequestStatus.PENDING,
                    },
                    _sum: {
                        amountBalance: true,
                    },
                })
            )._sum.amountBalance || 0
        );
    }

    async amountMoneyWithdrawalStatistics(
        time: number = 12,
        unit: EIntervalUnit = EIntervalUnit.months,
        gapUnit: EIntervalUnit = EIntervalUnit.months
    ) {
        const generateSeries = unit == EIntervalUnit.years ? time * 12 : time;
        const interval = `${time} ${unit}`;
        return await this.prisma.$queryRawUnsafe(`
        WITH statistic_withdrawal AS (
            SELECT date_trunc('${gapUnit}', CURRENT_DATE - INTERVAL '${interval}' + (n || ' ${gapUnit}')::interval) AS time
            FROM generate_series(0, ${generateSeries}) n
        )
        SELECT SUM(wr.amount_money)::int AS value, sw.time AS time
        FROM statistic_withdrawal sw
        LEFT JOIN withdrawal_request wr ON date_trunc('${gapUnit}', wr.created_at) = sw.time
        WHERE wr.status = '${WithdrawalRequestStatus.COMPLETED}'
        GROUP BY sw.time
        ORDER BY sw.time;
    `);
    }
}
