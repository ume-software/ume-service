import { ICrudOptionPrisma } from "@/services/base/basePrisma.service";
import { BasePrismaRepository } from "../base/basePrisma.repository"
import { Prisma, User } from "@prisma/client";



export class UserRepository extends BasePrismaRepository {
    constructor() {
        super()
    }


    async findAndCountAll(query?: ICrudOptionPrisma): Promise<{
        row: User[];
        count: number;
    }> {
        const [row, count] = await this.prisma.$transaction([
            this.prisma.user.findMany(query),
            this.prisma.user.count({
                where: query?.where
            })
        ]);
        return {
            row,
            count
        }

    }

    async create(userCreateInput: Prisma.UserCreateInput): Promise<User> {
        return await this.prisma.user.create({ data: userCreateInput })
    }

    async findOne(query?: ICrudOptionPrisma): Promise<User | null> {
        return await this.prisma.user.findFirst(query)
    }

    async delete(userWhereInput: Prisma.UserWhereInput): Promise<Prisma.BatchPayload> {
        return await this.prisma.user.deleteMany({ where: userWhereInput })
    }

}