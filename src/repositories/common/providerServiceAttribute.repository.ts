import { ICrudOptionPrisma } from "@/services/base/basePrisma.service";
import {
    BasePrismaRepository,
    PrismaTransaction,
} from "../base/basePrisma.repository";
import { Prisma, ProviderServiceAttribute } from "@prisma/client";

export class ProviderServiceAttributeRepository extends BasePrismaRepository {
    async findAndCountAll(query?: ICrudOptionPrisma): Promise<{
        row: ProviderServiceAttribute[];
        count: number;
    }> {
        const [row, count] = await this.prisma.$transaction([
            this.prisma.providerServiceAttribute.findMany(query),
            this.prisma.providerServiceAttribute.count({
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
    ): Promise<ProviderServiceAttribute> {
        return await tx.providerServiceAttribute.update({
            data: bookingCostUpdateInput,
            where: { id },
        });
    }

    async updateMany(
        providerServiceAttributeUpdateInput: Prisma.ProviderServiceAttributeUpdateInput,
        query: ICrudOptionPrisma,
        tx: PrismaTransaction = this.prisma
    ): Promise<Prisma.PrismaPromise<Prisma.BatchPayload>> {
        return await tx.providerServiceAttribute.updateMany({
            data: providerServiceAttributeUpdateInput,
            where: query.where,
        });
    }

    async create(
        providerServiceAttributeCreateInput: Prisma.ProviderServiceAttributeCreateInput,
        tx: PrismaTransaction = this.prisma
    ): Promise<ProviderServiceAttribute> {
        return await tx.providerServiceAttribute.create({
            data: providerServiceAttributeCreateInput,
        });
    }

    async findOne(
        query?: ICrudOptionPrisma,
        tx: PrismaTransaction = this.prisma
    ): Promise<ProviderServiceAttribute | null> {
        return await tx.providerServiceAttribute.findFirst(query);
    }

    async findMany(
        query?: ICrudOptionPrisma,
        tx: PrismaTransaction = this.prisma
    ): Promise<ProviderServiceAttribute[]> {
        return await tx.providerServiceAttribute.findMany(query);
    }

    async deleteById(
        id: string,
        tx: PrismaTransaction = this.prisma
    ): Promise<ProviderServiceAttribute> {
        return await tx.providerServiceAttribute.delete({ where: { id } });
    }

    async deleteMany(
        providerServiceAttributeWhereInput: Prisma.ProviderServiceAttributeWhereInput,
        tx: PrismaTransaction = this.prisma
    ): Promise<Prisma.BatchPayload> {
        return await tx.providerServiceAttribute.deleteMany({
            where: providerServiceAttributeWhereInput,
        });
    }
}
