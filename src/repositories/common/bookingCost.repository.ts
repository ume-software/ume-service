import { ICrudOptionPrisma } from "@/services/base/basePrisma.service";
import { BasePrismaRepository } from "../base/basePrisma.repository"
import { Prisma, BookingCost } from "@prisma/client";



export class BookingCostRepository extends BasePrismaRepository {
    constructor() {
        super()
    }


    async findAndCountAll(query?: ICrudOptionPrisma): Promise<{
        row: BookingCost[];
        count: number;
    }> {
        const [row, count] = await this.prisma.$transaction([
            this.prisma.bookingCost.findMany(query),
            this.prisma.bookingCost.count({
                where: query?.where
            })
        ]);
        return {
            row,
            count
        }

    }

    async updateById(id: string, bookingCostUpdateInput: Prisma.BookingCostUpdateInput) {
        return await this.prisma.skill.update({ data: bookingCostUpdateInput, where: { id } })
    }

    async update(bookingCostUpdateInput: Prisma.BookingCostUpdateInput, query: ICrudOptionPrisma) {
        return await this.prisma.skill.update({ data: bookingCostUpdateInput, where: query.where })
    }

    async create(bookingCostCreateInput: Prisma.BookingCostCreateInput): Promise<BookingCost> {
        return await this.prisma.bookingCost.create({ data: bookingCostCreateInput })
    }

    async findOne(query?: ICrudOptionPrisma): Promise<BookingCost | null> {
        return await this.prisma.bookingCost.findFirst(query)
    }
    
    async deleteById(id: string): Promise<BookingCost> {
        return await this.prisma.bookingCost.delete({ where: { id } })
    }

    async deleteMany(bookingCostWhereInput: Prisma.BookingCostWhereInput): Promise<Prisma.BatchPayload> {
        return await this.prisma.bookingCost.deleteMany({ where: bookingCostWhereInput })
    }



}