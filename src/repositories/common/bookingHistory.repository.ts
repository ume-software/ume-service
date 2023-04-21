import { ICrudOptionPrisma } from "@/services/base/basePrisma.service";
import { BasePrismaRepository } from "../base/basePrisma.repository"
import { Prisma, BookingHistory } from "@prisma/client";



export class BookingHistoryRepository extends BasePrismaRepository {
    constructor() {
        super()
    }


    async findAndCountAll(query?: ICrudOptionPrisma): Promise<{
        row: BookingHistory[];
        count: number;
    }> {
        const [row, count] = await this.prisma.$transaction([
            this.prisma.bookingHistory.findMany(query),
            this.prisma.bookingHistory.count({
                where: query?.where
            })
        ]);
        return {
            row,
            count
        }

    }
    async create(bookingHistoryCreateInput: Prisma.BookingHistoryCreateInput): Promise<BookingHistory> {
        return await this.prisma.bookingHistory.create({ data: bookingHistoryCreateInput })
    }

    async findOne(query?: ICrudOptionPrisma): Promise<BookingHistory | null> {
        return await this.prisma.bookingHistory.findFirst(query)
    }

    async delete(bookingHistoryWhereInput: Prisma.BookingHistoryWhereInput): Promise<Prisma.BatchPayload> {
        return await this.prisma.bookingHistory.deleteMany({ where: bookingHistoryWhereInput })
    }

}