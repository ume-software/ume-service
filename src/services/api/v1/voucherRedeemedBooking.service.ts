import { voucherRedeemedBookingRepository } from "@/repositories";
import { BasePrismaService } from "@/services/base/basePrisma.service";

export class VoucherRedeemedBookingService extends BasePrismaService<
    typeof voucherRedeemedBookingRepository
> {
    constructor() {
        super(voucherRedeemedBookingRepository);
    }
}
