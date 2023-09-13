import { adminRepository, adminRoleRepository } from "@/repositories";
import { errorService } from "@/services";
import { BasePrismaService } from "@/services/base/basePrisma.service";
import { ERROR_MESSAGE } from "@/services/errors/errorMessage";
import { AdminRoleType } from "@prisma/client";

export class AdminRoleService extends BasePrismaService<
  typeof adminRoleRepository
> {
  constructor() {
    super(adminRoleRepository);
  }

  async getByAdminId(adminId: string): Promise<{ roles: AdminRoleType[] }> {
    const admin = await adminRepository.findOne({
      where: {
        id: adminId,
      },
    });
    if (!admin) {
      throw errorService.error(ERROR_MESSAGE.ACCOUNT_NOT_FOUND);
    }
    const roles = (
      await this.repository.findMany({
        where: {
          adminId: admin.id,
        },

        select: {
          roleType: true,
        },
      })
    ).map((item) => item.roleType);
    return { roles };
  }
}
