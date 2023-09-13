import { ICrudOptionPrisma } from "@/services/base/basePrisma.service";
import {
    BasePrismaRepository,
    PrismaTransaction,
} from "../base/basePrisma.repository";
import { Prisma, User } from "@prisma/client";
export class UserRepository extends BasePrismaRepository {
    constructor() {
        super();
    }

    async findMany(query?: ICrudOptionPrisma) {
        return await this.prisma.user.findMany(query);
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

    async findOne(query?: ICrudOptionPrisma): Promise<User | null> {
        return await this.prisma.user.findFirst(query);
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
                createdAt: true,
                updatedAt: true,
            },
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
}
