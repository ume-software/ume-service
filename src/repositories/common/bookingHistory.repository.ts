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
    async findAllPendingBookingProvider(
        userId: string,
        tx: PrismaTransaction = this.prisma
    ) {
        const now = new Date(
            new Date().valueOf() - config.server.bookingExpireTimeMillisecond
        );
        const result = await tx.bookingHistory.findMany({
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
            select: {
                id: true,
            },
        });

        return this.findManyByIds(result.map((item) => item.id));
    }

    async findAllPendingBookingUser(
        userId: string,
        tx: PrismaTransaction = this.prisma
    ) {
        const now = new Date(
            new Date().valueOf() - config.server.bookingExpireTimeMillisecond
        );
        const result = await tx.bookingHistory.findMany({
            where: {
                booker: {
                    id: userId,
                },
                createdAt: {
                    gte: now,
                },
                status: BookingStatus.INIT,
            },
            select: {
                id: true,
            },
        });

        return this.findManyByIds(result.map((item) => item.id));
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
        bookingHistoryUpdateInput: Prisma.BookingHistoryUpdateInput,
        tx: PrismaTransaction = this.prisma
    ): Promise<BookingHistoryIncludeBookerAndProviderServiceIncludeProvider> {
        return await tx.bookingHistory.update({
            data: bookingHistoryUpdateInput,
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
                        deletedAt: null,
                    },
                    _sum: {
                        totalCost: true,
                    },
                })
            )._sum.totalCost || 0
        );
    }

    async getMostBookingServicesStatistics(limit: number) {
        return await this.prisma.$queryRaw`
            SELECT  s.id as id , s.name AS name, COUNT(bh.provider_service_id)::int AS value
            FROM booking_history bh
            JOIN provider_service ps ON bh.provider_service_id = ps.id
            JOIN service s ON ps.service_id = s.id
            GROUP BY s.name , s.id 
            ORDER BY value DESC
            LIMIT ${limit};
        `;
    }
    async findAllCurrentBookingByProviderId(providerId: string) {
        const result = (await this.prisma.$queryRaw`
                SELECT bh.id as id
                FROM booking_history bh
                WHERE provider_service_id  IN (
                    SELECT id FROM provider_service ps WHERE ps.provider_id  = ${providerId}
                )
                AND accepted_at + interval '1 hour' * booking_period > now()
                AND status = 'PROVIDER_ACCEPT';
        `) as any[];

        return this.findManyByIds(result.map((item) => item.id));
    }
    async findAllCurrentBookingByBookerId(bookerId: string) {
        const result = (await this.prisma.$queryRaw`
                SELECT bh.id as id
                FROM booking_history bh
                WHERE booker_id = ${bookerId}
                AND accepted_at + interval '1 hour' * booking_period > now()
                AND status = 'PROVIDER_ACCEPT';
        `) as any[];
        return this.findManyByIds(result.map((item) => item.id));
    }
    async getBookingCanFeedbackByUserSlug(
        providerId: string,
        bookerId: string
    ) {
        const result = (await this.prisma.$queryRaw`
            SELECT bh.id AS id FROM booking_history bh
            WHERE booker_id  = ${bookerId}
            AND provider_service_id  IN (
                SELECT id FROM provider_service ps WHERE ps.provider_id  = ${providerId}
            )
            AND accepted_at  IS NOT NULL
            AND (
                    (status IN ('PROVIDER_FINISH_SOON','USER_FINISH_SOON') AND updated_at > NOW() - INTERVAL '1 hour' * 24) OR
                    (status = 'PROVIDER_ACCEPT' AND accepted_at > NOW() - INTERVAL '1 hour' * (-booking_period + 24))
                )
            AND NOT EXISTS (
                SELECT * FROM feedback f WHERE f.booking_id = bh.id
            )
            ORDER BY accepted_at DESC
            LIMIT 1;
        `) as any[];
        return this.findManyByIds(result.map((item) => item.id));
    }

    async findManyByIds(ids: Array<string>) {
        return await this.prisma.bookingHistory.findMany({
            where: {
                id: { in: ids },
            },
            include: {
                providerService: {
                    include: {
                        provider: {
                            select: {
                                id: true,
                                avatarUrl: true,
                                dob: true,
                                gender: true,
                                isOnline: true,
                                name: true,
                                slug: true,
                            },
                        },
                        service: true,
                    },
                },
                booker: {
                    select: {
                        id: true,
                        avatarUrl: true,
                        dob: true,
                        gender: true,
                        isOnline: true,
                        name: true,
                        slug: true,
                    },
                },
            },
        });
    }
}
