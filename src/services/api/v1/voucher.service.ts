import { CreateVoucherRequest, UpdateVoucherRequest } from "@/common/requests";
import {
    adminRepository,
    userRepository,
    voucherRepository,
} from "@/repositories";
import { errorService } from "@/services";
import {
    BasePrismaService,
    ICrudOptionPrisma,
} from "@/services/base/basePrisma.service";
import { ERROR_MESSAGE } from "@/services/errors/errorMessage";
import { Voucher, VoucherStatus } from "@prisma/client";
export class VoucherService extends BasePrismaService<
    typeof voucherRepository
> {
    constructor() {
        super(voucherRepository);
    }
    async findAndCountAll(query?: ICrudOptionPrisma): Promise<{
        row: Voucher[];
        count: number;
    }> {
        return await this.repository.findAndCountAll(query);
    }
    async getMyVoucher(userId: string, _query?: ICrudOptionPrisma) {
        return await this.repository.findVoucherByBookerId(userId);
    }
    async providerCreateVoucher(
        userId: string,
        createVoucher: CreateVoucherRequest
    ) {
        const provider = await userRepository.findOne({
            where: {
                userId,
            },
        });
        if (!provider || provider.id != userId) {
            throw errorService.error(
                ERROR_MESSAGE.YOU_HAVE_NOT_BECOME_A_PROVIDER
            );
        }
        createVoucher.providerId = provider.id;
        createVoucher.isActivated = false;
        createVoucher.status = VoucherStatus.PENDING;
        return await this.repository.create(createVoucher);
    }
    async providerUpdateVoucher(
        userId: string,
        updateVoucherRequest: UpdateVoucherRequest
    ) {
        const provider = await userRepository.findOne({
            where: {
                userId,
            },
        });
        if (!provider || provider.id != userId) {
            throw errorService.error(
                ERROR_MESSAGE.YOU_HAVE_NOT_BECOME_A_PROVIDER
            );
        }
        const voucher = await this.repository.findOne({
            where: {
                id: updateVoucherRequest.id,
                providerId: provider.id,
            },
        });
        if (!voucher) {
            throw errorService.recordNotFound();
        }
        updateVoucherRequest.providerId = provider.id;
        updateVoucherRequest.isActivated = false;
        updateVoucherRequest.status = VoucherStatus.PENDING;

        return await this.repository.updateById(
            updateVoucherRequest.id,
            updateVoucherRequest
        );
    }
    async adminCreateVoucher(
        adminId: string,
        createVoucher: CreateVoucherRequest
    ) {
        const admin = await adminRepository.findOne({
            where: {
                id: adminId,
            },
        });
        if (!admin) {
            throw errorService.error(ERROR_MESSAGE.ACCOUNT_NOT_FOUND);
        }
        createVoucher.admin = {
            connect: {
                id: admin.id,
            },
        };
        createVoucher.status = VoucherStatus.APPROVED;
        return await this.repository.create(createVoucher);
    }
}
