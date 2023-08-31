import { voucherRepository } from "@/repositories";
import { BasePrismaService } from "@/services/base/basePrisma.service";

export class VoucherService extends BasePrismaService<
    typeof voucherRepository
> {
    constructor() {
        super(voucherRepository);
    }
}
