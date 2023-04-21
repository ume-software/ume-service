import { ICrudOptionPrisma } from "@/services/base/basePrisma.service";
import { BasePrismaRepository } from "../base/basePrisma.repository"
import { Prisma, Provider } from "@prisma/client";



export class ProviderRepository extends BasePrismaRepository {
    constructor() {
        super()
    }


    async findAndCountAll(query?: ICrudOptionPrisma): Promise<{
        row: Provider[];
        count: number;
    }> {
        const [row, count] = await this.prisma.$transaction([
            this.prisma.provider.findMany(query),
            this.prisma.provider.count({
                where: query?.where
            })
        ]);
        return {
            row,
            count
        }

    }
    async create(providerCreateInput: Prisma.ProviderCreateInput): Promise<Provider> {
        return await this.prisma.provider.create({ data: providerCreateInput })
    }

    async findOne(query?: ICrudOptionPrisma): Promise<Provider | null> {
        return await this.prisma.provider.findFirst(query)
    }

    async delete(providerWhereInput: Prisma.ProviderWhereInput): Promise<Prisma.BatchPayload> {
        return await this.prisma.provider.deleteMany({ where: providerWhereInput })
    }

}