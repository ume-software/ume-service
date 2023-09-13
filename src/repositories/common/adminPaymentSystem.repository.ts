import { ICrudOptionPrisma } from "@/services/base/basePrisma.service";
import { BasePrismaRepository } from "../base/basePrisma.repository"
import { Prisma, AdminPaymentSystem, PaymentSystemPlatform, AdminPaymentSystemStatus } from "@prisma/client";


export class AdminPaymentSystemRepository extends BasePrismaRepository {
    constructor() {
        super()
    }


    async findAndCountAll(query?: ICrudOptionPrisma): Promise<{
        row: AdminPaymentSystem[];
        count: number;
    }> {
        const [row, count] = await this.prisma.$transaction([
            this.prisma.adminPaymentSystem.findMany(query),
            this.prisma.adminPaymentSystem.count({
                where: query?.where
            })
        ]);
        return {
            row,
            count
        }

    }

    async getRandomByPlatForm(platformPayment: PaymentSystemPlatform) {
        const query = `
        SELECT 
            aps.id , 
            aps.created_at , 
            aps.updated_at , 
            aps.deleted_at , 
            aps.admin_id , 
            aps.platform ,
            aps.platform_account ,
            aps.beneficiary ,
            aps.is_cashier_account ,
            aps.is_ready ,
            aps.is_default 
        FROM admin_payment_system aps 
        where aps.platform = '${platformPayment}' AND aps.is_cashier_account = true AND aps.is_ready = true AND aps.status = '${AdminPaymentSystemStatus.APPROVED}'
        ORDER BY RANDOM()
        LIMIT 1;`
        let result: any = await this.prisma.$queryRawUnsafe(query);
        if (!result?.length) {
            const queryDefault = `
            SELECT 
                aps.id , 
                aps.created_at , 
                aps.updated_at , 
                aps.deleted_at , 
                aps.admin_id , 
                aps.platform ,
                aps.platform_account ,
                aps.beneficiary ,
                aps.is_cashier_account ,
                aps.is_ready ,
                aps.is_default 
            FROM admin_payment_system aps 
            where aps.platform = '${platformPayment}' AND aps.is_cashier_account = true AND aps.is_default = true AND aps.status = '${AdminPaymentSystemStatus.APPROVED}'
            ORDER BY RANDOM()
            LIMIT 1;`
            result = await this.prisma.$queryRawUnsafe(queryDefault);
        }
        if (!result?.length || !result) {
            return null
        }
        const {
            id,
            created_at: createdAt,
            updated_at: updatedAt,
            deleted_at: deletedAt,
            admin_id: adminId,
            platform,
            platform_account: platformAccount,
            beneficiary,
            is_cashier_account: isCashierAccount,
            is_ready: isReady,
            is_default: isDefault } = result[0];
        return {
            id,
            createdAt,
            updatedAt,
            deletedAt,
            adminId,
            platform,
            platformAccount,
            beneficiary,
            isCashierAccount,
            isReady,
            isDefault
        };
    }
    async delete(adminPaymentSystemWhereInput: Prisma.AdminPaymentSystemWhereInput): Promise<Prisma.BatchPayload> {
        return await this.prisma.adminPaymentSystem.deleteMany({ where: adminPaymentSystemWhereInput })
    }

    async updateById(id: string, adminPaymentSystemUpdateInput: Prisma.AdminPaymentSystemUpdateInput) {
        return await this.prisma.adminPaymentSystem.update({ data: adminPaymentSystemUpdateInput, where: { id } })
    }

    async update(adminPaymentSystemUpdateInput: Prisma.AdminPaymentSystemUpdateInput, query: ICrudOptionPrisma) {
        return await this.prisma.adminPaymentSystem.update({ data: adminPaymentSystemUpdateInput, where: query.where })
    }


    async create(adminPaymentSystemCreateInput: Prisma.AdminPaymentSystemCreateInput): Promise<AdminPaymentSystem> {
        return await this.prisma.$transaction(async (tx) => {
            const AdminPaymentSystem = await tx.adminPaymentSystem.create({ data: adminPaymentSystemCreateInput })
            return AdminPaymentSystem;
        })

    }

    async findOne(query?: ICrudOptionPrisma): Promise<AdminPaymentSystem | null> {
        return await this.prisma.adminPaymentSystem.findFirst(query)
    }


    async findMany(query?: ICrudOptionPrisma): Promise<AdminPaymentSystem[]> {
        return await this.prisma.adminPaymentSystem.findMany(query)
    }

    async deleteById(id: string): Promise<AdminPaymentSystem> {
        return await this.prisma.adminPaymentSystem.delete({ where: { id } })
    }

    async deleteMany(adminPaymentSystemWhereInput: Prisma.AdminPaymentSystemWhereInput): Promise<Prisma.BatchPayload> {
        return await this.prisma.adminPaymentSystem.deleteMany({ where: adminPaymentSystemWhereInput })
    }

}