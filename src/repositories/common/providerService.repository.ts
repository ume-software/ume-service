import { ICrudOptionPrisma } from "@/services/base/basePrisma.service";
import {
    BasePrismaRepository,
    PrismaTransaction,
} from "../base/basePrisma.repository";
import { Prisma, ProviderService } from "@prisma/client";

export class ProviderServiceRepository extends BasePrismaRepository {
    async findAndCountAll(query?: ICrudOptionPrisma): Promise<{
        row: ProviderService[];
        count: number;
    }> {
        const [row, count] = await this.prisma.$transaction([
            this.prisma.providerService.findMany(query),
            this.prisma.providerService.count({
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
    ): Promise<ProviderService> {
        return await tx.providerService.update({
            data: bookingCostUpdateInput,
            where: { id },
        });
    }

    async updateMany(
        providerServiceUpdateInput: Prisma.ProviderServiceUpdateInput,
        query: ICrudOptionPrisma,
        tx: PrismaTransaction = this.prisma
    ): Promise<Prisma.PrismaPromise<Prisma.BatchPayload>> {
        return await tx.providerService.updateMany({
            data: providerServiceUpdateInput,
            where: query.where,
        });
    }

    async create(
        providerServiceCreateInput: Prisma.ProviderServiceCreateInput,
        tx: PrismaTransaction = this.prisma
    ): Promise<ProviderService> {
        return await tx.providerService.create({
            data: providerServiceCreateInput,
        });
    }

    async countByProviderId(
        providerId: string,
        tx: PrismaTransaction = this.prisma
    ): Promise<number> {
        return await tx.providerService.count({
            where: {
                providerId,
            },
        });
    }
    async countByServiceId(
        serviceId: string,
        tx: PrismaTransaction = this.prisma
    ): Promise<number> {
        return await tx.providerService.count({
            where: {
                serviceId,
            },
        });
    }

    async findOne(
        query?: ICrudOptionPrisma,
        tx: PrismaTransaction = this.prisma
    ): Promise<ProviderService | null> {
        return await tx.providerService.findFirst(query);
    }

    async findOneIncludeBookingCostInSpecialTime(
        where: any,
        nowTimehhmm: string,
        tx: PrismaTransaction = this.prisma
    ) {
        const timeOfDateBookingCostCondition = [
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
       
        return await tx.providerService.findFirst({
            where,
            include: {
                bookingCosts: {
                    where: {
                        AND: [
                            ...timeOfDateBookingCostCondition,
                            { deletedAt: null },
                        ],
                    },
                    take: 1,
                },
                service: true,
            },
        });
    }
    async findMany(
        query?: ICrudOptionPrisma,
        tx: PrismaTransaction = this.prisma
    ): Promise<ProviderService[]> {
        return await tx.providerService.findMany(query);
    }

    async deleteById(
        id: string,
        tx: PrismaTransaction = this.prisma
    ): Promise<ProviderService> {
        return await tx.providerService.delete({ where: { id } });
    }

    async deleteMany(
        providerServiceWhereInput: Prisma.ProviderServiceWhereInput,
        tx: PrismaTransaction = this.prisma
    ): Promise<Prisma.BatchPayload> {
        return await tx.providerService.deleteMany({
            where: providerServiceWhereInput,
        });
    }

    async getMostProviderServicesStatistics(limit: number) {
        return await this.prisma.$queryRaw`
            SELECT s.id ,s.name AS name, COUNT(ps.service_id)::int AS value
            FROM provider_service ps
            JOIN service s ON ps.service_id = s.id
            GROUP BY s.name, s.id
            ORDER BY value DESC
            LIMIT ${limit};
        `;
    }
}
