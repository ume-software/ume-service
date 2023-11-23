import { ICrudOptionPrisma } from "@/services/base/basePrisma.service";
import {
    BasePrismaRepository,
    PrismaTransaction,
} from "../base/basePrisma.repository";
import {
    Prisma,
    BookingHistory,
    BookingStatus,
    ProviderService,
    User,
} from "@prisma/client";
import { config } from "@/configs";
export type BookingHistoryIncludeBookerAndProviderServiceIncludeProvider =
    BookingHistory & {
        providerService:
            | (ProviderService & {
                  provider: User;
              })
            | null;
        booker: User | null;
    };
export class BookingHistoryRepository extends BasePrismaRepository {
    async findAllCurrentBookingProvider(
        userId: string,
        tx: PrismaTransaction = this.prisma
    ) {
        const now = new Date(
            new Date().valueOf() - config.server.bookingExpireTimeMillisecond
        );
        return await tx.bookingHistory.findMany({
            where: {
                providerService: {
                    provider: {
                        id: userId,
                    },
                },
                createdAt: {
                    gte: now,
                },
                status: BookingStatus.INIT,
            },
            include: {
                booker: {
                    select: {
                        id: true,
                        avatarUrl: true,
                        dob: true,
                        name: true,
                        slug: true,
                        gender: true,
                    },
                },
                providerService: {
                    include: {
                        service: true,
                    },
                },
            },
        });
    }

    async findAllCurrentBookingUser(
        userId: string,
        tx: PrismaTransaction = this.prisma
    ) {
        const now = new Date(
            new Date().valueOf() - config.server.bookingExpireTimeMillisecond
        );
        return await tx.bookingHistory.findMany({
            where: {
                booker: {
                    id: userId,
                },
                createdAt: {
                    gte: now,
                },
                status: BookingStatus.INIT,
            },
            include: {
                providerService: {
                    include: {
                        service: true,
                        provider: {
                            select: {
                                id: true,
                                avatarUrl: true,
                                name: true,
                                slug: true,
                            },
                        },
                    },
                },
            },
        });
    }

    async findAndCountAll(query?: ICrudOptionPrisma): Promise<{
        row: BookingHistory[];
        count: number;
    }> {
        const [row, count] = await this.prisma.$transaction([
            this.prisma.bookingHistory.findMany(query),
            this.prisma.bookingHistory.count({
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
    ): Promise<BookingHistoryIncludeBookerAndProviderServiceIncludeProvider> {
        return await tx.bookingHistory.update({
            data: bookingCostUpdateInput,
            where: { id },
            include: {
                booker: true,
                providerService: {
                    include: {
                        provider: true,
                    },
                },
            },
        });
    }

    async updateMany(
        bookingHistoryUpdateInput: Prisma.BookingHistoryUpdateInput,
        query: ICrudOptionPrisma,
        tx: PrismaTransaction = this.prisma
    ): Promise<Prisma.PrismaPromise<Prisma.BatchPayload>> {
        return await tx.bookingHistory.updateMany({
            data: bookingHistoryUpdateInput,
            where: query.where,
        });
    }

    async create(
        bookingHistoryCreateInput: Prisma.BookingHistoryCreateInput,
        tx: PrismaTransaction = this.prisma
    ): Promise<BookingHistoryIncludeBookerAndProviderServiceIncludeProvider> {
        return await tx.bookingHistory.create({
            data: bookingHistoryCreateInput,
            include: {
                booker: true,
                providerService: {
                    include: {
                        provider: true,
                    },
                },
            },
        });
    }

    async findOne(
        query?: ICrudOptionPrisma,
        tx: PrismaTransaction = this.prisma
    ): Promise<BookingHistory | null> {
        return await tx.bookingHistory.findFirst(query);
    }

    async deleteById(
        id: string,
        tx: PrismaTransaction = this.prisma
    ): Promise<BookingHistory> {
        return await tx.bookingHistory.delete({ where: { id } });
    }

    async deleteMany(
        bookingHistoryWhereInput: Prisma.BookingHistoryWhereInput,
        tx: PrismaTransaction = this.prisma
    ): Promise<Prisma.BatchPayload> {
        return await tx.bookingHistory.deleteMany({
            where: bookingHistoryWhereInput,
        });
    }

    async getTotalBalanceFrozenByBookerId(
        bookerId: string,
        tx: PrismaTransaction = this.prisma
    ): Promise<number> {
        const now = new Date(
            new Date().valueOf() - config.server.bookingExpireTimeMillisecond
        );
        return (
            (
                await tx.bookingHistory.aggregate({
                    where: {
                        bookerId,
                        status: BookingStatus.INIT,
                        createdAt: {
                            gte: now,
                        },
                    },
                    _sum: {
                        totalCost: true,
                    },
                })
            )._sum.totalCost || 0
        );
    }

    async getMostBookingServicesStatistics() {
        return await this.prisma.$queryRaw`
            SELECT  s.id as id , s.name AS name, COUNT(bh.provider_service_id)::int AS value
            FROM booking_history bh
            JOIN provider_service ps ON bh.provider_service_id = ps.id
            JOIN service s ON ps.service_id = s.id
            GROUP BY s.name , s.id 
            ORDER BY value DESC;
        `;
    }

    async getBookingCanFeedbackByUserSlug(
        providerId: string,
        bookerId: string
    ) {
        return (
            (await this.prisma.$queryRaw`
            SELECT * FROM booking_history
            WHERE booker_id  = ${bookerId}
            AND provider_service_id  IN (
                SELECT id FROM provider_service ps WHERE ps.provider_id  = ${providerId}
            )
            AND accepted_at  IS NOT NULL
            and (
            (status in ('PROVIDER_FINISH_SOON','USER_FINISH_SOON') AND updated_at < NOW() - INTERVAL '1 hour' * 24) OR
                (status = 'PROVIDER_ACCEPT' AND accepted_at > NOW() - INTERVAL '1 hour' * (-booking_period + 24))
                )
            ORDER BY accepted_at DESC
            LIMIT 1;
        `) as any[]
        ).map((item) => ({
            id: item.id,
            createdAt: item.created_at,
            updatedAt: item.updated_at,
            deletedAt: item.deleted_at,
            status: item.status,
            acceptedAt: item.accepted_at,
            bookerId: item.booker_id,
            totalCost: item.total_cost,
            bookingPeriod: item.booking_period,
            appliedVoucherIds: item.applied_voucher_ids,
            providerServiceId: item.provider_service_id,
            providerReceivedBalance: item.provider_received_balance,
        }));
    }
}
