import { CreateVoucherRequest } from "@/common/requests";
import { userRepository, voucherRepository } from "@/repositories";
import { errorService } from "@/services";
import {
    BasePrismaService,
    ICrudOptionPrisma,
} from "@/services/base/basePrisma.service";
import { ERROR_MESSAGE } from "@/services/errors/errorMessage";
export class VoucherService extends BasePrismaService<
    typeof voucherRepository
> {
    constructor() {
        super(voucherRepository);
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

        return await this.repository.create(createVoucher);
    }
}
