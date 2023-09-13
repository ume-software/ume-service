import { adminPaymentSystemRepository } from "@/repositories";
import { BasePrismaService } from "@/services/base/basePrisma.service";


export class AdminPaymentSystemService extends BasePrismaService<
  typeof adminPaymentSystemRepository
> {
  constructor() {
    super(adminPaymentSystemRepository);
  }

}
