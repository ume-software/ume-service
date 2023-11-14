import { ICrudOptionPrisma } from "@/services/base/basePrisma.service";
import {
    BasePrismaRepository,
    PrismaTransaction,
} from "../base/basePrisma.repository";
import { Prisma, User } from "@prisma/client";
import { EIntervalUnit } from "@/enums/intervalUnit.enum";
export class UserRepository extends BasePrismaRepository {
    async findMany(query?: ICrudOptionPrisma) {
        return await this.prisma.user.findMany(query);
    }
    async count(
        query?: ICrudOptionPrisma,
        tx: PrismaTransaction = this.prisma
    ) {
        return await tx.user.count(query as any);
    }

    async findAndCountAll(query?: ICrudOptionPrisma): Promise<{
        row: User[];
        count: number;
    }> {
        const [row, count] = await this.prisma.$transaction([
            this.prisma.user.findMany(query),
            this.prisma.user.count({
                where: query?.where,
            }),
        ]);
        return {
            row,
            count,
        };
    }

    async create(
        userCreateInput: Prisma.UserCreateInput,
        tx: PrismaTransaction = this.prisma
    ): Promise<User> {
        return await tx.user.create({ data: userCreateInput });
    }

    async findOne(
        query?: ICrudOptionPrisma,
        tx: PrismaTransaction = this.prisma
    ): Promise<User | null> {
        return await tx.user.findFirst(query);
    }

    async findByEmail(email: string): Promise<User | null> {
        return await this.prisma.user.findFirst({ where: { email } });
    }

    async findByUsername(username: string): Promise<User | null> {
        return await this.prisma.user.findFirst({ where: { username } });
    }

    async delete(
        userWhereInput: Prisma.UserWhereInput,
        tx: PrismaTransaction = this.prisma
    ): Promise<Prisma.BatchPayload> {
        return await tx.user.deleteMany({ where: userWhereInput });
    }

    async getByIdOrSlug(slug: string) {
        return await this.prisma.user.findFirst({
            where: {
                OR: [
                    {
                        id: slug,
                    },
                    {
                        slug: slug,
                    },
                ],
            },
            select: {
                id: true,
                avatarUrl: true,
                dob: true,
                gender: true,
                name: true,
                slug: true,
                isOnline: true,
                isProvider: true,
                isBanned: true,
                latestOnline: true,
                createdAt: true,
                updatedAt: true,
                providerConfig: {
                    where: {
                        deletedAt: null,
                    },
                    select: {
                        voiceUrl: true,
                        description: true,
                        status: true,
                        isBanned: true,
                    },
                },
                providerServices: {
                    where: {
                        deletedAt: null,
                    },
                    select: {
                        id: true,
                        serviceId: true,
                        service: true,
                        defaultCost: true,
                        description: true,
                        position: true,
                        bookingCosts: {
                            where: {
                                deletedAt: null,
                            },
                            select: {
                                id: true,
                                amount: true,
                                endTimeOfDay: true,
                                startTimeOfDay: true,
                            },
                        },
                    },
                },
            },
        });
    }
    async updateById(
        userId: string,
        userUpdateInput: Prisma.UserUpdateInput,
        tx: PrismaTransaction = this.prisma
    ) {
        return await tx.user.update({
            where: {
                id: userId,
            },
            data: userUpdateInput,
        });
    }
    async updateUserProfileById(
        userId: string,
        userUpdateInput: Prisma.UserUpdateInput,
        tx: PrismaTransaction = this.prisma
    ) {
        return await tx.user.update({
            where: {
                id: userId,
            },
            data: userUpdateInput,
            select: {
                id: true,
                avatarUrl: true,
                dob: true,
                gender: true,
                name: true,
                slug: true,
                createdAt: true,
                updatedAt: true,
            },
        });
    }
    async newUserStatistics(
        time: number = 12,
        unit: EIntervalUnit = EIntervalUnit.months,
        gapUnit: EIntervalUnit = EIntervalUnit.months
    ) {
        const generateSeries = unit == EIntervalUnit.years ? time * 12 : time;
        const interval = `${time} ${unit}`;
        return await this.prisma.$queryRawUnsafe(`
            WITH statistic_user AS (
                SELECT date_trunc('${gapUnit}', CURRENT_DATE - INTERVAL '${interval}' + (n || ' ${gapUnit}')::interval) AS time
                FROM generate_series(0, ${generateSeries}) n
            )
            SELECT COUNT(u.created_at)::int AS value, sp.time AS time
            FROM statistic_user su
            LEFT JOIN "user" u ON date_trunc('${gapUnit}', u.created_at) = su.time
            GROUP BY su.time
            ORDER BY su.time;
        `);
    }
}
