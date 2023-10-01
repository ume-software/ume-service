import { ICrudOptionPrisma } from "@/services/base/basePrisma.service";
import {
    BasePrismaRepository,
    PrismaTransaction,
} from "../base/basePrisma.repository";
import { Prisma, ServiceAttributeValue } from "@prisma/client";

export class ServiceAttributeValueRepository extends BasePrismaRepository {
    constructor() {
        super();
    }

    async findAndCountAll(query?: ICrudOptionPrisma): Promise<{
        row: ServiceAttributeValue[];
        count: number;
    }> {
        const [row, count] = await this.prisma.$transaction([
            this.prisma.serviceAttributeValue.findMany(query),
            this.prisma.serviceAttributeValue.count({
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
        serviceAttributeValueUpdateInput: Prisma.ServiceAttributeValueUpdateInput,
        tx: PrismaTransaction = this.prisma
    ) {
        return await tx.serviceAttributeValue.update({
            data: serviceAttributeValueUpdateInput,
            where: { id },
        });
    }

    async update(
        serviceAttributeValueUpdateInput: Prisma.ServiceAttributeValueUpdateInput,
        query: ICrudOptionPrisma,
        tx: PrismaTransaction = this.prisma
    ) {
        return await tx.serviceAttributeValue.update({
            data: serviceAttributeValueUpdateInput,
            where: query.where,
        });
    }

    async create(
        serviceAttributeValueCreateInput: Prisma.ServiceAttributeValueCreateInput,
        tx: PrismaTransaction = this.prisma
    ): Promise<ServiceAttributeValue> {
        return await tx.serviceAttributeValue.create({
            data: serviceAttributeValueCreateInput,
        });
    }

    async findOne(
        query?: ICrudOptionPrisma,
        tx: PrismaTransaction = this.prisma
    ): Promise<ServiceAttributeValue | null> {
        return await tx.serviceAttributeValue.findFirst(query);
    }

    async findMany(
        query?: ICrudOptionPrisma,
        tx: PrismaTransaction = this.prisma
    ): Promise<ServiceAttributeValue[]> {
        return await tx.serviceAttributeValue.findMany(query);
    }

    async deleteById(
        id: string,
        tx: PrismaTransaction = this.prisma
    ): Promise<ServiceAttributeValue> {
        return await tx.serviceAttributeValue.delete({ where: { id } });
    }

    async deleteMany(
        serviceAttributeValueWhereInput: Prisma.ServiceAttributeValueWhereInput,
        tx: PrismaTransaction = this.prisma
    ): Promise<Prisma.BatchPayload> {
        return await tx.serviceAttributeValue.deleteMany({
            where: serviceAttributeValueWhereInput,
        });
    }
}
