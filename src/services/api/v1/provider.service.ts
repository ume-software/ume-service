import { IOptionFilterProvider } from "@/common/interface/IOptionFilterProvider.interface";
import { BecomeProviderRequest } from "@/common/requests/becomeProvider.request";
import { BecomeProviderResponse } from "@/common/responses/becomeProvider.response";
import { UserInfomationResponse } from "@/common/responses/userInfomation.reponse";

import { providerRepository } from "@/repositories";
import { errorService, identitySystemService } from "@/services";
import {
  BasePrismaService,
  ICrudOptionPrisma,
} from "@/services/base/basePrisma.service";
import { ERROR_MESSAGE } from "@/services/errors/errorMessage";
import { Prisma, Provider } from "@prisma/client";


export class ProviderService extends BasePrismaService<
  typeof providerRepository
> {
  constructor() {
    super(providerRepository);
  }
  async filterProvider(
    option: IOptionFilterProvider,
    query: ICrudOptionPrisma
  ) {
    const { skillId, startCost, endCost } = option;
    return await this.repository.filterAndCountAllProvider(skillId, startCost, endCost, query?.skip, query?.take);
  }

  async findAndCountAll(query: ICrudOptionPrisma) {
    if (!query.include) query.include = {};
    query.include = {
      ...query.include,
      providerSkills: {
        include: {
          bookingCosts: true,
        },
      },
    };
    const result = await this.repository.findAndCountAll(query);

    return result;
  }
  async getProviderBySlug(userSlug: string) {
    const result = await this.repository.getByIdOrSlug(userSlug);
    const { avatar, dob, name, gender, slug } = (await identitySystemService.getInfomation(result?.userId!)) as UserInfomationResponse;
    (result as any).user = {
      avatar,
      dob,
      name,
      slug,
      gender
    }
    return result;

  }
  async becomeProvider(
    userId: string,
    becomeProviderRequest: BecomeProviderRequest
  ): Promise<BecomeProviderResponse> {
    const preExistingProvider = await this.repository.findOne({
      where: {
        userId,
      },
    });
    if (preExistingProvider) {
      throw errorService.database.queryFail(
        ERROR_MESSAGE.YOU_ARE_ALREADY_A_PROVIDER
      );
    }
    const result = await this.repository.create({
      user: {
        connect: {
          id: userId,
        },
      },
      ...becomeProviderRequest,
    });

    return result as BecomeProviderResponse;
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
