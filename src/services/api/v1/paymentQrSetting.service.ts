import { paymentQrSettingRepository } from "@/repositories";
import { BasePrismaService } from "@/services/base/basePrisma.service";


export class PaymentQrSettingService extends BasePrismaService<
  typeof paymentQrSettingRepository
> {
  constructor() {
    super(paymentQrSettingRepository);
  }

}
