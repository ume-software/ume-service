import { IOptionFilterProvider } from "@/common/interface/IOptionFilterProvider.interface";
import { BecomeProviderRequest } from "@/common/requests/becomeProvider.request";
import { BecomeProviderResponse } from "@/common/responses/becomeProvider.response";
import { config } from "@/configs";

import { providerRepository } from "@/repositories";
import { errorService } from "@/services";
import {
  BasePrismaService,
  ICrudOptionPrisma,
} from "@/services/base/basePrisma.service";
import { ERROR_MESSAGE } from "@/services/errors/errorMessage";
import { Prisma, Provider } from "@prisma/client";
import moment from "moment";

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
    const nowTimehhmm = moment()
      .utcOffset(config.server.timezone)
      .format("HH:mm");
    const timeOfDateBookingCostConditon = [
      {
        startTimeOfDay: {
          lte: nowTimehhmm,
        },
      },
      {
        endTimeOfDay: {
          gte: nowTimehhmm,
        },
      },
    ];
    if (!query.where) query.where = {};
    query.include = {
      ...query.include,
      providerSkills: {
        take: 1,
        orderBy: [{ position: "asc" }],
        where: {
          deletedAt: null,
        },
        include: {
          bookingCosts: {
            where: {
              AND: [...timeOfDateBookingCostConditon, { deletedAt: null }],
            },
            take: 1,
          },
          skill: true,
        },
      },
    };
    if (skillId) {
      query.include.providerSkills.where = {
        skillId,
      };
      query.where.providerSkills = {
        ...query.where.providerSkills,
        some: {
          ...query.where.providerSkills?.some,
          skillId: skillId,
        },
      };
    }
    const amountCodition = [];
    const defaultCostCodition = [];
    if (startCost) {
      amountCodition.push({
        amount: {
          gte: startCost,
        },
      });
      defaultCostCodition.push({
        defaultCost: {
          gte: startCost,
        },
      });
    }
    if (endCost) {
      amountCodition.push({
        amount: {
          lte: endCost,
        },
      });
      defaultCostCodition.push({
        defaultCost: {
          lte: endCost,
        },
      });
    }
    if (!query.where.providerSkills) {
      query.where.providerSkills = {
        some: {},
      };
    }
    query.where.providerSkills.some = {
      ...query.where.providerSkills.some,
      deletedAt: null,
    };
    if (!query.where.providerSkills.some)
      if (amountCodition.length) {
        query.where.providerSkills.some.OR = [
          ...(query.where.providerSkills.some?.OR || []),
          {
            AND: defaultCostCodition,
          },
          {
            bookingCosts: {
              some: {
                AND: [...amountCodition, ...timeOfDateBookingCostConditon],
              },
            },
          },
        ];
      }

    return await this.repository.findAndCountAll(query);
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
