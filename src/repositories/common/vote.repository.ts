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
    async create(voteCreateInput: Prisma.VoteCreateInput): Promise<Vote> {
        return await this.prisma.vote.create({ data: voteCreateInput })
    }

    async findOne(query?: ICrudOptionPrisma): Promise<Vote | null> {
        return await this.prisma.vote.findFirst(query)
    }

    async delete(voteWhereInput: Prisma.VoteWhereInput): Promise<Prisma.BatchPayload> {
        return await this.prisma.vote.deleteMany({ where: voteWhereInput })
    }

}