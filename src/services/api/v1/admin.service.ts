
import { CreateAdminAccountRequest } from "@/common/requests/admin/createAdminAccount.request";
import { AdminInformationResponse } from "@/common/responses/admin/adminInformation.response";
import { adminRepository } from "@/repositories";
import { AdminIncludeAdminRoleAndAdminPaymentSystem } from "@/repositories/common/admin.repository";
import { bcryptService, errorService, utilService } from "@/services";
import { BasePrismaService, ICrudOptionPrisma } from "@/services/base/basePrisma.service";
import { ERROR_MESSAGE } from "@/services/errors/errorMessage";
import { Prisma } from "@prisma/client";

export class AdminService extends BasePrismaService<typeof adminRepository> {
    constructor() {
        super(adminRepository);
    }

    async create(adminCreateInput: Prisma.AdminCreateInput): Promise<AdminIncludeAdminRoleAndAdminPaymentSystem> {
        return await this.repository.create(adminCreateInput);

    }

    async adminCreateAccount(_adminId: string, adminCreateInput: CreateAdminAccountRequest): Promise<AdminIncludeAdminRoleAndAdminPaymentSystem> {
        adminCreateInput.password = await bcryptService.hashData(adminCreateInput.password);
        return await this.repository.adminCreateAccount(adminCreateInput);

    }


    async findOne(query?: ICrudOptionPrisma): Promise<AdminIncludeAdminRoleAndAdminPaymentSystem | null> {
        return await this.repository.findOne(query);
    }


    async getInfoByAdminId(userId: string): Promise<AdminInformationResponse> {
        const result = await this.repository.findOne({
            where: {
                id: userId
            },
            include: {
                adminRoles: {
                    where: {
                        deletedAt: null
                    }
                }
            }
        })
        if (!result) {
            throw errorService.error(ERROR_MESSAGE.ACCOUNT_NOT_FOUND)
        }

        return utilService.exclude(result, ['id', 'createdAt', 'updatedAt', 'deletedAt', 'ipv4', 'password', 'adminPaymentSystems', 'adminRoles']);
    }
}
