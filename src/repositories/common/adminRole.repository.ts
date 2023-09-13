import { ICrudOptionPrisma } from "@/services/base/basePrisma.service";
import { Prisma, AdminRole } from "@prisma/client";
import { BasePrismaRepository } from "../base/basePrisma.repository";


export class AdminRoleRepository extends BasePrismaRepository {
    constructor() {
        super()
    }


    async findAndCountAll(query?: ICrudOptionPrisma): Promise<{
        row: AdminRole[];
        count: number;
    }> {
        const [row, count] = await this.prisma.$transaction([
            this.prisma.adminRole.findMany(query),
            this.prisma.adminRole.count({
                where: query?.where
            })
        ]);
        return {
            row,
            count
        }

    }

    async delete(AdminRoleWhereInput: Prisma.AdminRoleWhereInput): Promise<Prisma.BatchPayload> {
        return await this.prisma.adminRole.deleteMany({ where: AdminRoleWhereInput })
    }

    async updateById(id: string, adminRoleUpdateInput: Prisma.AdminRoleUpdateInput) {
        return await this.prisma.adminRole.update({ data: adminRoleUpdateInput, where: { id } })
    }

    async update(adminRoleUpdateInput: Prisma.AdminRoleUpdateInput, query: ICrudOptionPrisma) {
        return await this.prisma.adminRole.update({ data: adminRoleUpdateInput, where: query.where })
    }

  
    async create(adminRoleCreateInput: Prisma.AdminRoleCreateInput): Promise<AdminRole> {
        return await this.prisma.$transaction(async (tx) => {
            const adminRole = await tx.adminRole.create({ data: adminRoleCreateInput })
            return adminRole;
        })

    }

    async findOne(query?: ICrudOptionPrisma): Promise<AdminRole | null> {
        return await this.prisma.adminRole.findFirst(query)
    }


    async findMany(query?: ICrudOptionPrisma): Promise<AdminRole[]> {
        return await this.prisma.adminRole.findMany(query)
    }

    async deleteById(id: string): Promise<AdminRole> {
        return await this.prisma.adminRole.delete({ where: { id } })
    }

    async deleteMany(adminRoleWhereInput: Prisma.AdminRoleWhereInput): Promise<Prisma.BatchPayload> {
        return await this.prisma.adminRole.deleteMany({ where: adminRoleWhereInput })
    }

}