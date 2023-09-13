import { Prisma, RefreshTokenAdmin } from "@prisma/client"

import { ICrudOptionPrisma } from "@/services/base/basePrisma.service"
import { BasePrismaRepository } from "../base/basePrisma.repository"


export class RefreshTokenAdminRepository extends BasePrismaRepository {

    constructor() {
        super()
    }

    async create(refreshTokenAdminCreateInput: Prisma.RefreshTokenAdminCreateInput): Promise<RefreshTokenAdmin> {
        return await this.prisma.refreshTokenAdmin.create({ data: refreshTokenAdminCreateInput })
    }

    async updateByAdminId(adminId: string, refreshTokenAdminUpdateInput: Prisma.RefreshTokenAdminUpdateInput): Promise<RefreshTokenAdmin> {
        return await this.prisma.refreshTokenAdmin.update({
            data: refreshTokenAdminUpdateInput,
            where: {
                adminId
            }
        })
    }

    async findOne(query?: ICrudOptionPrisma): Promise<RefreshTokenAdmin | null> {
        return await this.prisma.refreshTokenAdmin.findFirst(query)
    }

    async findOneByAdminId(adminId: string): Promise<RefreshTokenAdmin | null> {
        return await this.prisma.refreshTokenAdmin.findFirst({ where: { adminId } })
    }

    async findOneByRefreshToken(refreshToken: string): Promise<RefreshTokenAdmin | null> {
        return await this.prisma.refreshTokenAdmin.findFirst({ where: { refreshToken } })
    }
}