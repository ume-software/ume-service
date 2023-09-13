import { Prisma, RefreshTokenUser } from "@prisma/client"

import { ICrudOptionPrisma } from "@/services/base/basePrisma.service"
import { BasePrismaRepository } from "../base/basePrisma.repository"


export class RefreshTokenUserRepository extends BasePrismaRepository {

    constructor() {
        super()
    }

    async create(refreshTokenUserCreateInput: Prisma.RefreshTokenUserCreateInput): Promise<RefreshTokenUser> {
        return await this.prisma.refreshTokenUser.create({ data: refreshTokenUserCreateInput })
    }
    async updateByUserId(userId: string, refreshTokenUserUpdateInput: Prisma.RefreshTokenUserUpdateInput): Promise<RefreshTokenUser> {
        return await this.prisma.refreshTokenUser.update({
            data: refreshTokenUserUpdateInput,
            where: {
                userId
            }
        })
    }
    async findOne(query?: ICrudOptionPrisma): Promise<RefreshTokenUser | null> {
        return await this.prisma.refreshTokenUser.findFirst(query)
    }

    async findOneByUserId(userId: string): Promise<RefreshTokenUser | null> {
        return await this.prisma.refreshTokenUser.findFirst({ where: { userId } })
    }

    async findOneByRefreshToken(refreshToken: string): Promise<RefreshTokenUser | null> {
        return await this.prisma.refreshTokenUser.findFirst({ where: { refreshToken } })
    }
}