import { ICrudOptionPrisma } from "@/services/base/basePrisma.service";
import {
    BasePrismaRepository,
    PrismaTransaction,
} from "../base/basePrisma.repository";
import { Prisma, VoucherRedeemedBooking } from "@prisma/client";

export class VoucherRedeemedBookingRepository extends BasePrismaRepository {
 

    async findAndCountAll(query?: ICrudOptionPrisma): Promise<{
        row: VoucherRedeemedBooking[];
        count: number;
    }> {
        const [row, count] = await this.prisma.$transaction([
            this.prisma.voucherRedeemedBooking.findMany(query),
            this.prisma.voucherRedeemedBooking.count({
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
        voucherRedeemedBookingUpdateInput: Prisma.VoucherRedeemedBookingUpdateInput,
        tx: PrismaTransaction = this.prisma
    ) {
        return await tx.voucherRedeemedBooking.update({
            data: voucherRedeemedBookingUpdateInput,
            where: { id },
        });
    }

    async update(
        voucherRedeemedBookingUpdateInput: Prisma.VoucherRedeemedBookingUpdateInput,
        query: ICrudOptionPrisma,
        tx: PrismaTransaction = this.prisma
    ) {
        return await tx.voucherRedeemedBooking.update({
            data: voucherRedeemedBookingUpdateInput,
            where: query.where,
        });
    }

    async create(
        VoucherRedeemedBookingCreateInput: Prisma.VoucherRedeemedBookingCreateInput,
        tx: PrismaTransaction = this.prisma
    ): Promise<VoucherRedeemedBooking> {
        return await tx.voucherRedeemedBooking.create({
            data: VoucherRedeemedBookingCreateInput,
        });
    }

    async findOne(
        query?: ICrudOptionPrisma,
        tx: PrismaTransaction = this.prisma
    ): Promise<VoucherRedeemedBooking | null> {
        return await tx.voucherRedeemedBooking.findFirst(query);
    }

    async findById(
        id: string,
        tx: PrismaTransaction = this.prisma
    ): Promise<VoucherRedeemedBooking | null> {
        return await tx.voucherRedeemedBooking.findFirst({
            where: {
                id,
            },
        });
    }

    async findMany(
        query?: ICrudOptionPrisma,
        tx: PrismaTransaction = this.prisma
    ): Promise<VoucherRedeemedBooking[]> {
        return await tx.voucherRedeemedBooking.findMany(query);
    }

    async deleteById(
        id: string,
        tx: PrismaTransaction = this.prisma
    ): Promise<VoucherRedeemedBooking> {
        return await tx.voucherRedeemedBooking.delete({ where: { id } });
    }

    async deleteMany(
        voucherRedeemedBookingWhereInput: Prisma.VoucherRedeemedBookingWhereInput,
        tx: PrismaTransaction = this.prisma
    ): Promise<Prisma.BatchPayload> {
        return await tx.voucherRedeemedBooking.deleteMany({
            where: voucherRedeemedBookingWhereInput,
        });
    }
}
