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
    async upsertById(userCreateInput: Prisma.UserCreateInput): Promise<User> {
        let user = await this.prisma.user.findFirst({ where: { id: userCreateInput.id!! } })
        if (!user) {
            user = await this.prisma.user.create({
                data: userCreateInput
            })
        } else {
            user = await this.prisma.user.update({
                where: {
                    id: userCreateInput.id!!
                },
                data: userCreateInput
            })
        }
        return user

    }


    async updateById(id: string, bookingCostUpdateInput: Prisma.BookingCostUpdateInput):Promise<User> {
        return await this.prisma.user.update({ data: bookingCostUpdateInput, where: { id } })
    }

    async updateMany(userUpdateInput: Prisma.UserUpdateInput, query: ICrudOptionPrisma):Promise<Prisma.PrismaPromise<Prisma.BatchPayload>>  {
        return await this.prisma.user.updateMany({ data: userUpdateInput, where: query.where })
    }

    async create(userCreateInput: Prisma.UserCreateInput): Promise<User> {
        return await this.prisma.user.create({ data: userCreateInput })
    }

    async findOne(query?: ICrudOptionPrisma): Promise<User | null> {
        return await this.prisma.user.findFirst(query)
    }

    async findMany(query?: ICrudOptionPrisma): Promise<User[]> {
        return await this.prisma.user.findMany(query)
    }

    async deleteById(id: string): Promise<User> {
        return await this.prisma.user.delete({ where: { id } })
    }

    async deleteMany(userWhereInput: Prisma.UserWhereInput): Promise<Prisma.BatchPayload> {
        return await this.prisma.user.deleteMany({ where: userWhereInput })
    }

}