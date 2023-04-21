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
    async create(coinHistoryCreateInput: Prisma.CoinHistoryCreateInput): Promise<CoinHistory> {
        return await this.prisma.coinHistory.create({ data: coinHistoryCreateInput })
    }

    async findOne(query?: ICrudOptionPrisma): Promise<CoinHistory | null> {
        return await this.prisma.coinHistory.findFirst(query)
    }

    async delete(coinHistoryWhereInput: Prisma.CoinHistoryWhereInput): Promise<Prisma.BatchPayload> {
        return await this.prisma.coinHistory.deleteMany({ where: coinHistoryWhereInput })
    }

}