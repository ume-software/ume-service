import { ICrudOptionPrisma } from "@/services/base/basePrisma.service";
import {
    BasePrismaRepository,
    PrismaTransaction,
} from "../base/basePrisma.repository";
import { Prisma, BookingHistory, BookingStatus, ProviderSkill, Provider, User } from "@prisma/client";
import { config } from "@/configs";
export type BookingHistoryIncludeBookerAndProviderSkillIncludeProvider = BookingHistory & {
    providerSkill: (ProviderSkill & {
        provider: Provider;
    }) | null;
    booker: User | null
}
export class BookingHistoryRepository extends BasePrismaRepository {
    constructor() {
        super();
    }

    async findAllCurrentBookingProvider(userId: string, tx: PrismaTransaction = this.prisma) {
        const now = new Date(new Date().valueOf() - config.server.bookingExpireTimeMillisecond);
        return await tx.bookingHistory.findMany({
            where: {
                providerSkill: {
                    provider: {
                        user: {
                            id: userId
                        }
                    }
                },
                createdAt: {
                    gte: now,
                },
                status: BookingStatus.INIT
            },
            include: {
                providerSkill: {
                    include: {
                        skill: true
                    }
                }
            }
        })

    }

    async findAllCurrentBookingUser(userId: string, tx: PrismaTransaction = this.prisma) {
        const now = new Date(new Date().valueOf() - config.server.bookingExpireTimeMillisecond);
        return await tx.bookingHistory.findMany({
            where: {
                booker: {
                    id: userId
                },
                createdAt: {
                    gte: now,
                },
                status: BookingStatus.INIT
            },
            include: {
                providerSkill: {
                    include: {
                        skill: true,
                        provider: {
                            select: {
                                avatarUrl: true,
                                voiceUrl: true,
                                name: true,
                                slug: true,
                                id: true

                            }
                        }
                    }
                },
            }
        })

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
    ): Promise<BookingHistoryIncludeBookerAndProviderSkillIncludeProvider> {
        return await tx.bookingHistory.update({
            data: bookingCostUpdateInput,
            where: { id },
            include: {
                booker: true,
                providerSkill: {
                    include: {
                        provider: true
                    }
                }
            }
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
    ): Promise<BookingHistoryIncludeBookerAndProviderSkillIncludeProvider> {
        return await tx.bookingHistory.create({
            data: bookingHistoryCreateInput,
            include: {
                booker: true,
                providerSkill: {
                    include: {
                        provider: true
                    }
                }
            }
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

    async getTotalCoinFrozenByBookerId(
        bookerId: string,
        tx: PrismaTransaction = this.prisma
    ): Promise<number> {

        const now = new Date(new Date().valueOf() - config.server.bookingExpireTimeMillisecond);
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
}
