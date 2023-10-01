import { ICrudOptionPrisma } from "@/services/base/basePrisma.service";
import {
    BasePrismaRepository,
    PrismaTransaction,
} from "../base/basePrisma.repository";
import { Prisma, ServiceAttribute } from "@prisma/client";

export class ServiceAttributeRepository extends BasePrismaRepository {
    constructor() {
        super();
    }

    async findAndCountAll(query?: ICrudOptionPrisma): Promise<{
        row: ServiceAttribute[];
        count: number;
    }> {
        const [row, count] = await this.prisma.$transaction([
            this.prisma.serviceAttribute.findMany(query),
            this.prisma.serviceAttribute.count({
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
        serviceAttributeUpdateInput: Prisma.ServiceAttributeUpdateInput,
        tx: PrismaTransaction = this.prisma
    ) {
        return await tx.serviceAttribute.update({
            data: serviceAttributeUpdateInput,
            where: { id },
        });
    }

    async update(
        serviceAttributeUpdateInput: Prisma.ServiceAttributeUpdateInput,
        query: ICrudOptionPrisma,
        tx: PrismaTransaction = this.prisma
    ) {
        return await tx.serviceAttribute.update({
            data: serviceAttributeUpdateInput,
            where: query.where,
        });
    }

    async create(
        serviceAttributeCreateInput: Prisma.ServiceAttributeCreateInput,
        tx: PrismaTransaction = this.prisma
    ): Promise<ServiceAttribute> {
        return await tx.serviceAttribute.create({
            data: serviceAttributeCreateInput,
        });
    }

    async findOne(
        query?: ICrudOptionPrisma,
        tx: PrismaTransaction = this.prisma
    ): Promise<ServiceAttribute | null> {
        return await tx.serviceAttribute.findFirst(query);
    }

    async findMany(
        query?: ICrudOptionPrisma,
        tx: PrismaTransaction = this.prisma
    ): Promise<ServiceAttribute[]> {
        return await tx.serviceAttribute.findMany(query);
    }

    async deleteById(
        id: string,
        tx: PrismaTransaction = this.prisma
    ): Promise<ServiceAttribute> {
        return await tx.serviceAttribute.delete({ where: { id } });
    }

    async deleteMany(
        serviceAttributeWhereInput: Prisma.ServiceAttributeWhereInput,
        tx: PrismaTransaction = this.prisma
    ): Promise<Prisma.BatchPayload> {
        return await tx.serviceAttribute.deleteMany({
            where: serviceAttributeWhereInput,
        });
    }
}
