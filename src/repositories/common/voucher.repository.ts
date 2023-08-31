import { ICrudOptionPrisma } from "@/services/base/basePrisma.service";
import {
    BasePrismaRepository,
    PrismaTransaction,
} from "../base/basePrisma.repository";
import { Prisma, Voucher } from "@prisma/client";

export class VoucherRepository extends BasePrismaRepository {
    constructor() {
        super();
    }

    async findAndCountAll(query?: ICrudOptionPrisma): Promise<{
        row: Voucher[];
        count: number;
    }> {
        const [row, count] = await this.prisma.$transaction([
            this.prisma.voucher.findMany(query),
            this.prisma.voucher.count({
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
        voucherUpdateInput: Prisma.VoucherUpdateInput,
        tx: PrismaTransaction = this.prisma
    ) {
        return await tx.voucher.update({
            data: voucherUpdateInput,
            where: { id },
        });
    }

    async update(
        voucherUpdateInput: Prisma.VoucherUpdateInput,
        query: ICrudOptionPrisma,
        tx: PrismaTransaction = this.prisma
    ) {
        return await tx.voucher.update({
            data: voucherUpdateInput,
            where: query.where,
        });
    }

    async create(
        VoucherCreateInput: Prisma.VoucherCreateInput,
        tx: PrismaTransaction = this.prisma
    ): Promise<Voucher> {
        return await tx.voucher.create({ data: VoucherCreateInput });
    }

    async findOne(
        query?: ICrudOptionPrisma,
        tx: PrismaTransaction = this.prisma
    ): Promise<Voucher | null> {
        return await tx.voucher.findFirst(query);
    }

    async findById(
        id: string,
        tx: PrismaTransaction = this.prisma
    ): Promise<Voucher | null> {
        return await tx.voucher.findFirst({
            where: {
                id,
            },
        });
    }

    async findMany(
        query?: ICrudOptionPrisma,
        tx: PrismaTransaction = this.prisma
    ): Promise<Voucher[]> {
        return await tx.voucher.findMany(query);
    }

    async deleteById(
        id: string,
        tx: PrismaTransaction = this.prisma
    ): Promise<Voucher> {
        return await tx.voucher.delete({ where: { id } });
    }

    async deleteMany(
        voucherWhereInput: Prisma.VoucherWhereInput,
        tx: PrismaTransaction = this.prisma
    ): Promise<Prisma.BatchPayload> {
        return await tx.voucher.deleteMany({
            where: voucherWhereInput,
        });
    }
}
