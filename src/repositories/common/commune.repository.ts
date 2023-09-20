import { ICrudOptionPrisma } from "@/services/base/basePrisma.service";
import {
    BasePrismaRepository,
    PrismaTransaction,
} from "../base/basePrisma.repository";
import { Commune } from "@prisma/client";

export class CommuneRepository extends BasePrismaRepository {
    async findAndCountAll(query?: ICrudOptionPrisma): Promise<{
        row: Commune[];
        count: number;
    }> {
        const [row, count] = await this.prisma.$transaction([
            this.prisma.commune.findMany(query),
            this.prisma.commune.count({
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
    ): Promise<Commune | null> {
        return await tx.commune.findFirst(query);
    }

    async findMany(
        query?: ICrudOptionPrisma,
        tx: PrismaTransaction = this.prisma
    ): Promise<Commune[]> {
        return await tx.commune.findMany(query);
    }
}
