import { ICrudOptionPrisma } from "@/services/base/basePrisma.service";
import {
    BasePrismaRepository,
    PrismaTransaction,
} from "../base/basePrisma.repository";
import { Prisma, ProviderSkill } from "@prisma/client";

export class ProviderSkillRepository extends BasePrismaRepository {
 

    async findAndCountAll(query?: ICrudOptionPrisma): Promise<{
        row: ProviderSkill[];
        count: number;
    }> {
        const [row, count] = await this.prisma.$transaction([
            this.prisma.providerSkill.findMany(query),
            this.prisma.providerSkill.count({
                where: query?.where,
            }),
        ]);
        return {
            row,
            count,
        };
    }

    async updateById(
        id: string,
        bookingCostUpdateInput: Prisma.BookingCostUpdateInput,
        tx: PrismaTransaction = this.prisma
    ): Promise<ProviderSkill> {
        return await tx.providerSkill.update({
            data: bookingCostUpdateInput,
            where: { id },
        });
    }

    async updateMany(
        providerSkillUpdateInput: Prisma.ProviderSkillUpdateInput,
        query: ICrudOptionPrisma,
        tx: PrismaTransaction = this.prisma
    ): Promise<Prisma.PrismaPromise<Prisma.BatchPayload>> {
        return await tx.providerSkill.updateMany({
            data: providerSkillUpdateInput,
            where: query.where,
        });
    }

    async create(
        providerSkillCreateInput: Prisma.ProviderSkillCreateInput,
        tx: PrismaTransaction = this.prisma
    ): Promise<ProviderSkill> {
        return await tx.providerSkill.create({
            data: providerSkillCreateInput,
        });
    }

    async countByProviderId(
        providerId: string,
        tx: PrismaTransaction = this.prisma
    ): Promise<number> {
        return await tx.providerSkill.count({
            where: {
                providerId,
            },
        });
    }

    async findOne(
        query?: ICrudOptionPrisma,
        tx: PrismaTransaction = this.prisma
    ): Promise<ProviderSkill | null> {
        return await tx.providerSkill.findFirst(query);
    }

    async findOneIncludeBookingCostInSpecialTime(
        where: any,
        nowTimehhmm: string,
        tx: PrismaTransaction = this.prisma
    ) {
        const timeOfDateBookingCostConditon = [
            {
                startTimeOfDay: {
                    lte: nowTimehhmm,
                },
            },
            {
                endTimeOfDay: {
                    gte: nowTimehhmm,
                },
            },
        ];
        return await tx.providerSkill.findFirst({
            where,
            include: {
                bookingCosts: {
                    where: {
                        AND: [
                            ...timeOfDateBookingCostConditon,
                            { deletedAt: null },
                        ],
                    },
                    take: 1,
                },
                skill: true,
            },
        });
    }
    async findMany(
        query?: ICrudOptionPrisma,
        tx: PrismaTransaction = this.prisma
    ): Promise<ProviderSkill[]> {
        return await tx.providerSkill.findMany(query);
    }

    async deleteById(
        id: string,
        tx: PrismaTransaction = this.prisma
    ): Promise<ProviderSkill> {
        return await tx.providerSkill.delete({ where: { id } });
    }

    async deleteMany(
        providerSkillWhereInput: Prisma.ProviderSkillWhereInput,
        tx: PrismaTransaction = this.prisma
    ): Promise<Prisma.BatchPayload> {
        return await tx.providerSkill.deleteMany({
            where: providerSkillWhereInput,
        });
    }
}
