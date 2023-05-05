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

    async updateById(id: string, bookingCostUpdateInput: Prisma.BookingCostUpdateInput):Promise<Provider> {
        return await this.prisma.provider.update({ data: bookingCostUpdateInput, where: { id } })
    }

    async updateMany(providerUpdateInput: Prisma.ProviderUpdateInput, query: ICrudOptionPrisma):Promise<Prisma.PrismaPromise<Prisma.BatchPayload>>  {
        return await this.prisma.provider.updateMany({ data: providerUpdateInput, where: query.where })
    }

    async create(providerCreateInput: Prisma.ProviderCreateInput): Promise<Provider> {
        return await this.prisma.provider.create({ data: providerCreateInput })
    }

    async findOne(query?: ICrudOptionPrisma): Promise<Provider | null> {
        return await this.prisma.provider.findFirst(query)
    }

    async findMany(query?: ICrudOptionPrisma): Promise<Provider[]> {
        return await this.prisma.provider.findMany(query)
    }

    async deleteById(id: string): Promise<Provider> {
        return await this.prisma.provider.delete({ where: { id } })
    }

    async deleteMany(providerWhereInput: Prisma.ProviderWhereInput): Promise<Prisma.BatchPayload> {
        return await this.prisma.provider.deleteMany({ where: providerWhereInput })
    }
}