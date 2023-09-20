import { ICrudOptionPrisma } from "@/services/base/basePrisma.service";
import {
    BasePrismaRepository,
    PrismaTransaction,
} from "../base/basePrisma.repository";
import { District } from "@prisma/client";

export class DistrictRepository extends BasePrismaRepository {
    async findAndCountAll(query?: ICrudOptionPrisma): Promise<{
        row: District[];
        count: number;
    }> {
        const [row, count] = await this.prisma.$transaction([
            this.prisma.district.findMany(query),
            this.prisma.district.count({
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
    ): Promise<District | null> {
        return await tx.district.findFirst(query);
    }

    async findMany(
        query?: ICrudOptionPrisma,
        tx: PrismaTransaction = this.prisma
    ): Promise<District[]> {
        return await tx.district.findMany(query);
    }
}
