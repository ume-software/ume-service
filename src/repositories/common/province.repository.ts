import { ICrudOptionPrisma } from "@/services/base/basePrisma.service";
import {
    BasePrismaRepository,
    PrismaTransaction,
} from "../base/basePrisma.repository";
import { Province } from "@prisma/client";

export class ProvinceRepository extends BasePrismaRepository {
 

    async findAndCountAll(query?: ICrudOptionPrisma): Promise<{
        row: Province[];
        count: number;
    }> {
        const [row, count] = await this.prisma.$transaction([
            this.prisma.province.findMany(query),
            this.prisma.province.count({
                where: query?.where,
            }),
        ]);
        return {
            row,
            count,
        };
    }

    async findOne(
        query?: ICrudOptionPrisma,
        tx: PrismaTransaction = this.prisma
    ): Promise<Province | null> {
        return await tx.province.findFirst(query);
    }

    async findMany(
        query?: ICrudOptionPrisma,
        tx: PrismaTransaction = this.prisma
    ): Promise<Province[]> {
        return await tx.province.findMany(query);
    }
}
