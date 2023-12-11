import { ICrudOptionPrisma } from "@/services/base/basePrisma.service";
import {
    BasePrismaRepository,
    PrismaTransaction,
} from "../base/basePrisma.repository";
import { Prisma, BookingComplaint } from "@prisma/client";

export class BookingComplaintRepository extends BasePrismaRepository {
    constructor() {
        super();
    }

    async findAndCountAll(query?: ICrudOptionPrisma): Promise<{
        row: BookingComplaint[];
        count: number;
    }> {
        const [row, count] = await this.prisma.$transaction([
            this.prisma.bookingComplaint.findMany(query),
            this.prisma.bookingComplaint.count({
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
        bookingComplaintUpdateInput: Prisma.BookingComplaintUpdateInput,
        tx: PrismaTransaction = this.prisma
    ) {
        return await tx.bookingComplaint.update({
            data: bookingComplaintUpdateInput,
            where: { id },
        });
    }

    async update(
        bookingComplaintUpdateInput: Prisma.BookingComplaintUpdateInput,
        query: ICrudOptionPrisma,
        tx: PrismaTransaction = this.prisma
    ) {
        return await tx.bookingComplaint.update({
            data: bookingComplaintUpdateInput,
            where: query.where,
        });
    }

    async create(
        BookingComplaintCreateInput: Prisma.BookingComplaintCreateInput,
        tx: PrismaTransaction = this.prisma
    ): Promise<BookingComplaint> {
        return await tx.bookingComplaint.create({
            data: BookingComplaintCreateInput,
        });
    }

    async findOne(
        query?: ICrudOptionPrisma,
        tx: PrismaTransaction = this.prisma
    ): Promise<BookingComplaint | null> {
        return await tx.bookingComplaint.findFirst(query);
    }

    async findById(
        id: string,
        tx: PrismaTransaction = this.prisma
    ): Promise<BookingComplaint | null> {
        return await tx.bookingComplaint.findFirst({
            where: {
                id,
            },
        });
    }

    async findMany(
        query?: ICrudOptionPrisma,
        tx: PrismaTransaction = this.prisma
    ): Promise<BookingComplaint[]> {
        return await tx.bookingComplaint.findMany(query);
    }

    async deleteById(
        id: string,
        tx: PrismaTransaction = this.prisma
    ): Promise<BookingComplaint> {
        return await tx.bookingComplaint.delete({ where: { id } });
    }

    async deleteMany(
        bookingComplaintWhereInput: Prisma.BookingComplaintWhereInput,
        tx: PrismaTransaction = this.prisma
    ): Promise<Prisma.BatchPayload> {
        return await tx.bookingComplaint.deleteMany({
            where: bookingComplaintWhereInput,
        });
    }
}
