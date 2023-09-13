import { ICrudOptionPrisma } from "@/services/base/basePrisma.service";
import { BasePrismaRepository, PrismaTransaction } from "../base/basePrisma.repository"
import { Prisma, Admin, AdminRole, AdminPaymentSystem } from "@prisma/client";
import { CreateAdminAccountRequest } from "@/common/requests/admin/createAdminAccount.request";

export type AdminIncludeAdminRoleAndAdminPaymentSystem = (Admin & {
    adminRoles?: AdminRole[];
    adminPaymentSystems?: AdminPaymentSystem[];
}) | null

export class AdminRepository extends BasePrismaRepository {
    constructor() {
        super()
    }


    async findAndCountAll(query?: ICrudOptionPrisma): Promise<{
        row: Admin[];
        count: number;
    }> {
        this.prisma.user
        const [row, count] = await this.prisma.$transaction([
            this.prisma.admin.findMany(query),
            this.prisma.admin.count({
                where: query?.where
            })
        ]);
        return {
            row,
            count
        }

    }

    async create(
        adminCreateInput: Prisma.AdminCreateInput,
        tx: PrismaTransaction = this.prisma
    ): Promise<AdminIncludeAdminRoleAndAdminPaymentSystem> {
        return await tx.admin.create({ data: adminCreateInput })

    }

    async adminCreateAccount(adminCreateInput: CreateAdminAccountRequest): Promise<AdminIncludeAdminRoleAndAdminPaymentSystem> {
        return await this.prisma.$transaction(async (tx) => {
            const { roles, ...adminCreateInputData } = adminCreateInput;
            const admin = await tx.admin.create({ data: adminCreateInputData });
            if (roles) {
                for (let index = 0; index < roles.length; index++) {
                    await tx.adminRole.create({
                        data: {
                            admin: {
                                connect: {
                                    id: admin.id
                                }
                            },
                            roleType: roles[index]!
                        }
                    })
                }
            }
            return admin;
        })
    }

    async findOne(query?: ICrudOptionPrisma): Promise<AdminIncludeAdminRoleAndAdminPaymentSystem | null> {
        return await this.prisma.admin.findFirst(query)
    }

    async findByEmail(email: string): Promise<AdminIncludeAdminRoleAndAdminPaymentSystem | null> {
        return await this.prisma.admin.findFirst({ where: { email } })
    }

    async findByUsername(username: string): Promise<AdminIncludeAdminRoleAndAdminPaymentSystem | null> {
        return await this.prisma.admin.findFirst({ where: { username } })
    }

    async delete(
        AdminWhereInput: Prisma.AdminWhereInput,
        tx: PrismaTransaction = this.prisma
    ): Promise<Prisma.BatchPayload> {
        return await tx.admin.deleteMany({ where: AdminWhereInput })
    }

    // async syncDataAdmin(AdminCreateInput: Prisma.AdminCreateInput) {
    //     const bodyRequest = {
    //         id: AdminCreateInput.id,
    //         createdAt: AdminCreateInput.createdAt,
    //         updatedAt: AdminCreateInput.updatedAt,
    //         deletedAt: AdminCreateInput.deletedAt
    //     }
    //     return await utilService.fetch(config.service.ume.url).post("system/admin/sync", {
    //         data: cryptoService.encryptStringWithRsaPublicKey(bodyRequest, config.service.ume.path_public_key)
    //     })
    // }

    async updateById(id: string, adminUpdateInput: Prisma.AdminUpdateInput, tx: PrismaTransaction = this.prisma) {
        return await tx.admin.update({ data: adminUpdateInput, where: { id } })
    }

    async update(adminUpdateInput: Prisma.AdminUpdateInput, query: ICrudOptionPrisma, tx: PrismaTransaction = this.prisma) {
        return await tx.admin.update({ data: adminUpdateInput, where: query.where })
    }


    async findMany(query?: ICrudOptionPrisma, tx: PrismaTransaction = this.prisma): Promise<AdminIncludeAdminRoleAndAdminPaymentSystem[]> {
        return await tx.admin.findMany(query)
    }

    async deleteById(id: string, tx: PrismaTransaction = this.prisma): Promise<AdminIncludeAdminRoleAndAdminPaymentSystem> {
        return await tx.admin.delete({ where: { id } })
    }

    async deleteMany(adminWhereInput: Prisma.AdminWhereInput, tx: PrismaTransaction = this.prisma): Promise<Prisma.BatchPayload> {
        return await tx.admin.deleteMany({ where: adminWhereInput })
    }

}