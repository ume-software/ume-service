import { ICrudOptionPrisma } from "@/services/base/basePrisma.service";
import { BasePrismaRepository } from "../base/basePrisma.repository"
import { Prisma, CoinHistory } from "@prisma/client";



export class CoinHistoryRepository extends BasePrismaRepository {
    constructor() {
        super()
    }


    async findAndCountAll(query?: ICrudOptionPrisma): Promise<{
        row: CoinHistory[];
        count: number;
    }> {
        const [row, count] = await this.prisma.$transaction([
            this.prisma.coinHistory.findMany(query),
            this.prisma.coinHistory.count({
                where: query?.where
            })
        ]);
        return {
            row,
            count
        }

    }

    async updateById(id: string, bookingCostUpdateInput: Prisma.BookingCostUpdateInput):Promise<CoinHistory> {
        return await this.prisma.coinHistory.update({ data: bookingCostUpdateInput, where: { id } })
    }

    async updateMany(CoinHistoryUpdateInput: Prisma.CoinHistoryUpdateInput, query: ICrudOptionPrisma):Promise<Prisma.PrismaPromise<Prisma.BatchPayload>>  {
        return await this.prisma.coinHistory.updateMany({ data: CoinHistoryUpdateInput, where: query.where })
    }

    async create(coinHistoryCreateInput: Prisma.CoinHistoryCreateInput): Promise<CoinHistory> {
        return await this.prisma.coinHistory.create({ data: coinHistoryCreateInput })
    }

    async findOne(query?: ICrudOptionPrisma): Promise<CoinHistory | null> {
        return await this.prisma.coinHistory.findFirst(query)
    }

    async findMany(query?: ICrudOptionPrisma): Promise<CoinHistory[]> {
        return await this.prisma.coinHistory.findMany(query)
    }

    async deleteById(id: string): Promise<CoinHistory> {
        return await this.prisma.coinHistory.delete({ where: { id } })
    }

    async deleteMany(coinHistoryWhereInput: Prisma.CoinHistoryWhereInput): Promise<Prisma.BatchPayload> {
        return await this.prisma.coinHistory.deleteMany({ where: coinHistoryWhereInput })
    }
}