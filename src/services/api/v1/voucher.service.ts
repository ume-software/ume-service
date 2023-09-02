import { CreateVoucherRequest } from "@/common/requests";
import { providerRepository, voucherRepository } from "@/repositories";
import { errorService } from "@/services";
import {
    BasePrismaService,
    ICrudOptionPrisma,
} from "@/services/base/basePrisma.service";
import { ERROR_MESSAGE } from "@/services/errors/errorMessage";
import { Voucher } from "@prisma/client";

export class VoucherService extends BasePrismaService<
    typeof voucherRepository
> {
    constructor() {
        super(voucherRepository);
    }
    async getMyVoucher(
        userId: string,
        query?: ICrudOptionPrisma
    ): Promise<{
        row: Voucher[];
        count: number;
    }> {
        console.log(userId);
        return await this.repository.findAndCountAll(query);
    }
    async providerCreateVoucher(
        userId: string,
        createVoucher: CreateVoucherRequest
    ) {
        const provider = await providerRepository.findOne({
            where: {
                userId,
            },
        });
        if (!provider || provider.userId != userId) {
            throw errorService.auth.permissionDeny(
                ERROR_MESSAGE.YOU_HAVE_NOT_BECOME_A_PROVIDER
            );
        }
        createVoucher.providerId = provider.id;

        return await this.repository.create(createVoucher);
    }
}
