import { ICrudOptionPrisma } from "@/services/base/basePrisma.service";
import {
    BasePrismaRepository,
    PrismaTransaction,
} from "../base/basePrisma.repository";
import { Prisma, BookingComplaintResponse } from "@prisma/client";

export class BookingComplaintResponseRepository extends BasePrismaRepository {
    constructor() {
        super();
    }

    async findAndCountAll(query?: ICrudOptionPrisma): Promise<{
        row: BookingComplaintResponse[];
        count: number;
    }> {
        const [row, count] = await this.prisma.$transaction([
            this.prisma.bookingComplaintResponse.findMany(query),
            this.prisma.bookingComplaintResponse.count({
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
        bookingComplaintResponseUpdateInput: Prisma.BookingComplaintResponseUpdateInput,
        tx: PrismaTransaction = this.prisma
    ) {
        return await tx.bookingComplaintResponse.update({
            data: bookingComplaintResponseUpdateInput,
            where: { id },
        });
    }

    async update(
        bookingComplaintResponseUpdateInput: Prisma.BookingComplaintResponseUpdateInput,
        query: ICrudOptionPrisma,
        tx: PrismaTransaction = this.prisma
    ) {
        return await tx.bookingComplaintResponse.update({
            data: bookingComplaintResponseUpdateInput,
            where: query.where,
        });
    }

    async create(
        BookingComplaintResponseCreateInput: Prisma.BookingComplaintResponseCreateInput,
        tx: PrismaTransaction = this.prisma
    ): Promise<BookingComplaintResponse> {
        return await tx.bookingComplaintResponse.create({
            data: BookingComplaintResponseCreateInput,
        });
    }

    async findOne(
        query?: ICrudOptionPrisma,
        tx: PrismaTransaction = this.prisma
    ): Promise<BookingComplaintResponse | null> {
        return await tx.bookingComplaintResponse.findFirst(query);
    }

    async findById(
        id: string,
        tx: PrismaTransaction = this.prisma
    ): Promise<BookingComplaintResponse | null> {
        return await tx.bookingComplaintResponse.findFirst({
            where: {
                id,
            },
        });
    }

    async findMany(
        query?: ICrudOptionPrisma,
        tx: PrismaTransaction = this.prisma
    ): Promise<BookingComplaintResponse[]> {
        return await tx.bookingComplaintResponse.findMany(query);
    }

    async deleteById(
        id: string,
        tx: PrismaTransaction = this.prisma
    ): Promise<BookingComplaintResponse> {
        return await tx.bookingComplaintResponse.delete({ where: { id } });
    }

    async deleteMany(
        bookingComplaintResponseWhereInput: Prisma.BookingComplaintResponseWhereInput,
        tx: PrismaTransaction = this.prisma
    ): Promise<Prisma.BatchPayload> {
        return await tx.bookingComplaintResponse.deleteMany({
            where: bookingComplaintResponseWhereInput,
        });
    }
}
