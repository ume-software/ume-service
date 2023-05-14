import { ICrudOptionPrisma } from "@/services/base/basePrisma.service";
import {
    BasePrismaRepository,
    PrismaTransation,
} from "../base/basePrisma.repository";
import { Prisma, BookingHistory, BookingStatus } from "@prisma/client";

export class BookingHistoryRepository extends BasePrismaRepository {
    constructor() {
        super();
    }

    async findAndCountAll(query?: ICrudOptionPrisma): Promise<{
        row: BookingHistory[];
        count: number;
    }> {
        const [row, count] = await this.prisma.$transaction([
            this.prisma.bookingHistory.findMany(query),
            this.prisma.bookingHistory.count({
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
        tx: PrismaTransation = this.prisma
    ): Promise<BookingHistory> {
        return await tx.bookingHistory.update({
            data: bookingCostUpdateInput,
            where: { id },
        });
    }

    async updateMany(
        bookingHistoryUpdateInput: Prisma.BookingHistoryUpdateInput,
        query: ICrudOptionPrisma,
        tx: PrismaTransation = this.prisma
    ): Promise<Prisma.PrismaPromise<Prisma.BatchPayload>> {
        return await tx.bookingHistory.updateMany({
            data: bookingHistoryUpdateInput,
            where: query.where,
        });
    }

    async create(
        bookingHistoryCreateInput: Prisma.BookingHistoryCreateInput,
        tx: PrismaTransation = this.prisma
    ): Promise<BookingHistory> {
        return await tx.bookingHistory.create({
            data: bookingHistoryCreateInput,
        });
    }

    async findOne(
        query?: ICrudOptionPrisma,
        tx: PrismaTransation = this.prisma
    ): Promise<BookingHistory | null> {
        return await tx.bookingHistory.findFirst(query);
    }

    async deleteById(
        id: string,
        tx: PrismaTransation = this.prisma
    ): Promise<BookingHistory> {
        return await tx.bookingHistory.delete({ where: { id } });
    }

    async deleteMany(
        bookingHistoryWhereInput: Prisma.BookingHistoryWhereInput,
        tx: PrismaTransation = this.prisma
    ): Promise<Prisma.BatchPayload> {
        return await tx.bookingHistory.deleteMany({
            where: bookingHistoryWhereInput,
        });
    }

    async getTotalCoinFrozenByBookerId(
        bookerId: string,
        tx: PrismaTransation = this.prisma
    ): Promise<number> {
        const fiveMinutes = 5 * 60 * 1000;
        const now = new Date(new Date().valueOf() - fiveMinutes);
        return (
            (
                await tx.bookingHistory.aggregate({
                    where: {
                        bookerId,
                        status: BookingStatus.INIT,
                        createdAt: {
                            gte: now,
                        },
                    },
                    _sum: {
                        totalCost: true,
                    },
                })
            )._sum.totalCost || 0
        );
    }
}
