import { ICrudOptionPrisma } from "@/services/base/basePrisma.service";
import {
    BasePrismaRepository,
    PrismaTransaction,
} from "../base/basePrisma.repository";
import { Prisma, ProviderConfig } from "@prisma/client";
import { EIntervalUnit } from "@/enums/intervalUnit.enum";

export class ProviderConfigRepository extends BasePrismaRepository {
    async findAndCountAll(query?: ICrudOptionPrisma): Promise<{
        row: ProviderConfig[];
        count: number;
    }> {
        const [row, count] = await this.prisma.$transaction([
            this.prisma.providerConfig.findMany(query),
            this.prisma.providerConfig.count({
                where: query?.where,
            }),
        ]);
        return {
            row,
            count,
        };
    }
    async count(
        query?: ICrudOptionPrisma,
        tx: PrismaTransaction = this.prisma
    ) {
        return await tx.user.count(query as any);
    }
    async updateById(
        id: string,
        providerConfigUpdateInput: Prisma.ProviderConfigUpdateInput,
        tx: PrismaTransaction = this.prisma
    ) {
        return await tx.providerConfig.update({
            data: providerConfigUpdateInput,
            where: { id },
        });
    }

    async update(
        providerConfigUpdateInput: Prisma.ProviderConfigUpdateInput,
        query: ICrudOptionPrisma,
        tx: PrismaTransaction = this.prisma
    ) {
        return await tx.providerConfig.update({
            data: providerConfigUpdateInput,
            where: query.where,
        });
    }

    async create(
        ProviderConfigCreateInput: Prisma.ProviderConfigCreateInput,
        tx: PrismaTransaction = this.prisma
    ): Promise<ProviderConfig> {
        return await tx.providerConfig.create({
            data: ProviderConfigCreateInput,
        });
    }

    async findOne(
        query?: ICrudOptionPrisma,
        tx: PrismaTransaction = this.prisma
    ): Promise<ProviderConfig | null> {
        return await tx.providerConfig.findFirst(query);
    }

    async findById(
        id: string,
        tx: PrismaTransaction = this.prisma
    ): Promise<ProviderConfig | null> {
        return await tx.providerConfig.findFirst({
            where: {
                id,
            },
        });
    }

    async findMany(
        query?: ICrudOptionPrisma,
        tx: PrismaTransaction = this.prisma
    ): Promise<ProviderConfig[]> {
        return await tx.providerConfig.findMany(query);
    }

    async deleteById(
        id: string,
        tx: PrismaTransaction = this.prisma
    ): Promise<ProviderConfig> {
        return await tx.providerConfig.delete({ where: { id } });
    }

    async deleteMany(
        providerConfigWhereInput: Prisma.ProviderConfigWhereInput,
        tx: PrismaTransaction = this.prisma
    ): Promise<Prisma.BatchPayload> {
        return await tx.providerConfig.deleteMany({
            where: providerConfigWhereInput,
        });
    }

    async newProviderStatistics(
        time: number = 12,
        unit: EIntervalUnit = EIntervalUnit.months,
        gapUnit: EIntervalUnit = EIntervalUnit.months
    ) {
        const generateSeries = unit == EIntervalUnit.years ? time * 12 : time;
        const interval = `${time} ${unit}`;
        return await this.prisma.$queryRawUnsafe(`
            WITH statistic_provider AS (
                SELECT date_trunc('${gapUnit}', CURRENT_DATE - INTERVAL '${interval}' + (n || ' ${gapUnit}')::interval) AS time
                FROM generate_series(0, ${generateSeries}) n
            )
            SELECT COUNT(pc.created_at)::int AS value, sp.time AS time
            FROM statistic_provider sp
            LEFT JOIN "provider_config" pc ON date_trunc('${gapUnit}', pc.created_at) = sp.time
            GROUP BY sp.time
            ORDER BY sp.time;
        `);
    }
}
