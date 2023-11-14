import { ICrudOptionPrisma } from "@/services/base/basePrisma.service";
import {
    BasePrismaRepository,
    PrismaTransaction,
} from "../base/basePrisma.repository";
import { Prisma, DepositRequest, DepositRequestStatus } from "@prisma/client";
import { EIntervalUnit } from "@/enums/intervalUnit.enum";

export class DepositRequestRepository extends BasePrismaRepository {
    constructor() {
        super();
    }

    async findAndCountAll(query?: ICrudOptionPrisma): Promise<{
        row: DepositRequest[];
        count: number;
    }> {
        const [row, count] = await this.prisma.$transaction([
            this.prisma.depositRequest.findMany(query),
            this.prisma.depositRequest.count({
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
        depositRequestUpdateInput: Prisma.DepositRequestUpdateInput,
        tx: PrismaTransaction = this.prisma
    ) {
        return await tx.depositRequest.update({
            data: depositRequestUpdateInput,
            where: { id },
        });
    }

    async update(
        depositRequestUpdateInput: Prisma.DepositRequestUpdateInput,
        query: ICrudOptionPrisma,
        tx: PrismaTransaction = this.prisma
    ) {
        return await tx.depositRequest.update({
            data: depositRequestUpdateInput,
            where: query.where,
        });
    }

    async create(
        DepositRequestCreateInput: Prisma.DepositRequestCreateInput,
        tx: PrismaTransaction = this.prisma
    ): Promise<DepositRequest> {
        return await tx.depositRequest.create({
            data: DepositRequestCreateInput,
        });
    }

    async findOne(
        query?: ICrudOptionPrisma,
        tx: PrismaTransaction = this.prisma
    ): Promise<DepositRequest | null> {
        return await tx.depositRequest.findFirst(query);
    }

    async findById(
        id: string,
        tx: PrismaTransaction = this.prisma
    ): Promise<DepositRequest | null> {
        return await tx.depositRequest.findFirst({
            where: {
                id,
            },
        });
    }

    async findMany(
        query?: ICrudOptionPrisma,
        tx: PrismaTransaction = this.prisma
    ): Promise<DepositRequest[]> {
        return await tx.depositRequest.findMany(query);
    }

    async deleteById(
        id: string,
        tx: PrismaTransaction = this.prisma
    ): Promise<DepositRequest> {
        return await tx.depositRequest.delete({ where: { id } });
    }

    async deleteMany(
        depositRequestWhereInput: Prisma.DepositRequestWhereInput,
        tx: PrismaTransaction = this.prisma
    ): Promise<Prisma.BatchPayload> {
        return await tx.depositRequest.deleteMany({
            where: depositRequestWhereInput,
        });
    }

    async amountMoneyDepositStatistics(
        time: number = 12,
        unit: EIntervalUnit = EIntervalUnit.months,
        gapUnit: EIntervalUnit = EIntervalUnit.months
    ) {
        const generateSeries = unit == EIntervalUnit.years ? time * 12 : time;
        const interval = `${time} ${unit}`;
        return await this.prisma.$queryRawUnsafe(`
        WITH statistic_deposit AS (
            SELECT date_trunc('${gapUnit}', CURRENT_DATE - INTERVAL '${interval}' + (n || ' ${gapUnit}')::interval) AS time
            FROM generate_series(0, ${generateSeries}) n
        )
        SELECT COUNT(dr.created_at)::int AS value, sd.time AS time
        FROM statistic_deposit sd
        LEFT JOIN deposit_request dr ON date_trunc('${gapUnit}', dr.created_at) = sd.time
        WHERE dr.status = '${DepositRequestStatus.APPROVED}'
        GROUP BY sd.time
        ORDER BY sd.time;
    `);
    }
}
