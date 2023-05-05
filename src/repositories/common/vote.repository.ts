import { ICrudOptionPrisma } from "@/services/base/basePrisma.service";
import { BasePrismaRepository } from "../base/basePrisma.repository"
import { Prisma, Vote } from "@prisma/client";



export class VoteRepository extends BasePrismaRepository {
    constructor() {
        super()
    }


    async findAndCountAll(query?: ICrudOptionPrisma): Promise<{
        row: Vote[];
        count: number;
    }> {
        const [row, count] = await this.prisma.$transaction([
            this.prisma.vote.findMany(query),
            this.prisma.vote.count({
                where: query?.where
            })
        ]);
        return {
            row,
            count
        }

    }
   

    async updateById(id: string, bookingCostUpdateInput: Prisma.BookingCostUpdateInput):Promise<Vote> {
        return await this.prisma.vote.update({ data: bookingCostUpdateInput, where: { id } })
    }

    async updateMany(voteUpdateInput: Prisma.VoteUpdateInput, query: ICrudOptionPrisma):Promise<Prisma.PrismaPromise<Prisma.BatchPayload>>  {
        return await this.prisma.vote.updateMany({ data: voteUpdateInput, where: query.where })
    }

    async create(voteCreateInput: Prisma.VoteCreateInput): Promise<Vote> {
        return await this.prisma.vote.create({ data: voteCreateInput })
    }

    async findOne(query?: ICrudOptionPrisma): Promise<Vote | null> {
        return await this.prisma.vote.findFirst(query)
    }

    async findMany(query?: ICrudOptionPrisma): Promise<Vote[]> {
        return await this.prisma.vote.findMany(query)
    }

    async deleteById(id: string): Promise<Vote> {
        return await this.prisma.vote.delete({ where: { id } })
    }

    async deleteMany(voteWhereInput: Prisma.VoteWhereInput): Promise<Prisma.BatchPayload> {
        return await this.prisma.vote.deleteMany({ where: voteWhereInput })
    }
}