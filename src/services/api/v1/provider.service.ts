import { BecomeProviderRequest } from "@/common/requests/becomeProvider.request";
import { BecomeProviderResponse } from "@/common/responses/becomeProvider.response";
import { providerRepository } from "@/repositories";
import {
  BasePrismaService,
  ICrudOptionPrisma,
} from "@/services/base/basePrisma.service";
import { Prisma, Provider } from "@prisma/client";

export class ProviderService extends BasePrismaService<
  typeof providerRepository
> {
  constructor() {
    super(providerRepository);
  }
  async becomeProvider(
    userId: string,
    becomeProviderRequest: BecomeProviderRequest
  ): Promise<BecomeProviderResponse> {
    const results = await this.repository.create({
      user: {
        connect: {
          id: userId,
        },
      },
      ...becomeProviderRequest,
    });

    return results as BecomeProviderResponse;
  }
  async create(
    providerCreateInput: Prisma.ProviderCreateInput
  ): Promise<Provider> {
    return await this.repository.create(providerCreateInput);
  }

  async findOne(query?: ICrudOptionPrisma): Promise<Provider | null> {
    return await this.repository.findOne(query);
  }
}
