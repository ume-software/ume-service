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
    async findOne(query?: ICrudOptionPrisma) {
        return await this.repository.findOne(query);
    }

    async getMyVoucher(userId: string, query: ICrudOptionPrisma) {
        return await this.repository.findVoucherByBookerId(
            userId,
            undefined,
            query.select,
            query.skip
        );
    }
    async providerCreateVoucher(
        userId: string,
        createVoucher: CreateVoucherRequest
    ) {
        const provider = await userRepository.findOne({
            where: {
                id: userId,
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
                id: userId,
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

        if (
            Object.keys(updateVoucherRequest).length === 2 &&
            "isActivated" in updateVoucherRequest
        ) {
            return await this.repository.update(
                {
                    isActivated: updateVoucherRequest.isActivated!,
                },
                {
                    where: { id: voucher.id },
                }
            );
        }
        if (voucher.status == VoucherStatus.APPROVED) {
            throw errorService.error(
                ERROR_MESSAGE.YOU_CAN_ONLY_UPDATE_UNAPPROVED_VOUCHER
            );
        }

        if (updateVoucherRequest.isActivated == true) {
            updateVoucherRequest.isPublished = true;
        }
        updateVoucherRequest.providerId = provider.id;

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

    async adminUpdateVoucher(
        adminId: string,
        voucherId: string,
        updateVoucherRequest: UpdateVoucherRequest
    ) {
        const admin = await adminRepository.findOne({
            where: {
                id: adminId,
            },
        });
        if (!admin) {
            throw errorService.error(ERROR_MESSAGE.ACCOUNT_NOT_FOUND);
        }
        const voucher = await this.repository.findOne({
            where: {
                id: updateVoucherRequest.id,
            },
        });
        if (!voucher) {
            throw errorService.recordNotFound();
        }

        const voucherType = voucher.providerId
            ? "PROVIDER_VOUCHER"
            : "ADMIN_VOUCHER";
        switch (voucherType) {
            case "PROVIDER_VOUCHER": {
                if (
                    Object.keys(updateVoucherRequest).length === 1 &&
                    "isActivated" in updateVoucherRequest
                ) {
                    return await this.repository.update(
                        {
                            isActivated: updateVoucherRequest.isActivated!,
                        },
                        {
                            where: { id: voucherId },
                        }
                    );
                }

                if (voucher.status == VoucherStatus.APPROVED) {
                    throw errorService.badRequest(
                        ERROR_MESSAGE.YOU_CAN_ONLY_UPDATE_UNAPPROVED_VOUCHER
                    );
                }
                delete updateVoucherRequest.status;
                return await this.repository.update(updateVoucherRequest, {
                    where: { id: voucherId },
                });

                break;
            }
            case "ADMIN_VOUCHER": {
                if (
                    voucher.isPublished &&
                    !(Object.keys(updateVoucherRequest).length === 1 && "status" in updateVoucherRequest)
                ) {
                    throw errorService.badRequest(
                        ERROR_MESSAGE.YOU_CAN_ONLY_UPDATE_UNPUBLISHED_VOUCHER
                    );
                }
                if (updateVoucherRequest.isActivated) {
                    updateVoucherRequest.isPublished = true;
                }
                return await this.repository.update(updateVoucherRequest, {
                    where: { id: voucherId },
                });
                break;
            }
        }
    }
}
