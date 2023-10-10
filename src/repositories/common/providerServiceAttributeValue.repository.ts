import { ICrudOptionPrisma } from "@/services/base/basePrisma.service";
import {
    BasePrismaRepository,
    PrismaTransaction,
} from "../base/basePrisma.repository";
import { Prisma, ProviderServiceAttributeValue } from "@prisma/client";

export class ProviderServiceAttributeValueRepository extends BasePrismaRepository {
    async findAndCountAll(query?: ICrudOptionPrisma): Promise<{
        row: ProviderServiceAttributeValue[];
        count: number;
    }> {
        const [row, count] = await this.prisma.$transaction([
            this.prisma.providerServiceAttributeValue.findMany(query),
            this.prisma.providerServiceAttributeValue.count({
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
    ): Promise<ProviderServiceAttributeValue> {
        return await tx.providerServiceAttributeValue.update({
            data: bookingCostUpdateInput,
            where: { id },
        });
    }

    async updateMany(
        providerServiceAttributeValueUpdateInput: Prisma.ProviderServiceAttributeValueUpdateInput,
        query: ICrudOptionPrisma,
        tx: PrismaTransaction = this.prisma
    ): Promise<Prisma.PrismaPromise<Prisma.BatchPayload>> {
        return await tx.providerServiceAttributeValue.updateMany({
            data: providerServiceAttributeValueUpdateInput,
            where: query.where,
        });
    }

    async create(
        providerServiceAttributeValueCreateInput: Prisma.ProviderServiceAttributeValueCreateInput,
        tx: PrismaTransaction = this.prisma
    ): Promise<ProviderServiceAttributeValue> {
        return await tx.providerServiceAttributeValue.create({
            data: providerServiceAttributeValueCreateInput,
        });
    }

    async findOne(
        query?: ICrudOptionPrisma,
        tx: PrismaTransaction = this.prisma
    ): Promise<ProviderServiceAttributeValue | null> {
        return await tx.providerServiceAttributeValue.findFirst(query);
    }

    async findMany(
        query?: ICrudOptionPrisma,
        tx: PrismaTransaction = this.prisma
    ): Promise<ProviderServiceAttributeValue[]> {
        return await tx.providerServiceAttributeValue.findMany(query);
    }

    async deleteById(
        id: string,
        tx: PrismaTransaction = this.prisma
    ): Promise<ProviderServiceAttributeValue> {
        return await tx.providerServiceAttributeValue.delete({ where: { id } });
    }

    async deleteMany(
        providerServiceAttributeValueWhereInput: Prisma.ProviderServiceAttributeValueWhereInput,
        tx: PrismaTransaction = this.prisma
    ): Promise<Prisma.BatchPayload> {
        return await tx.providerServiceAttributeValue.deleteMany({
            where: providerServiceAttributeValueWhereInput,
        });
    }
}
