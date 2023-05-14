import { ProviderSkillRequest } from "@/common/requests/providerSkill.request";
import prisma from "@/models/base.prisma";
import {
  bookingCostRepository,
  providerRepository,
  providerSkillRepository,
} from "@/repositories";
import { PrismaTransation } from "@/repositories/base/basePrisma.repository";
import { errorService, skillService, utilService } from "@/services";
import { BasePrismaService, ICrudOptionPrisma } from "@/services/base/basePrisma.service";
import { ERROR_MESSAGE } from "@/services/errors/errorMessage";
import { Prisma, ProviderSkill } from "@prisma/client";

export class ProviderSkillService extends BasePrismaService<
  typeof providerSkillRepository
> {
  constructor() {
    super(providerSkillRepository);
  }

  async create(userId: string, providerSkillRequest: ProviderSkillRequest) {
    const { skillId, defaultCost, bookingCosts } = providerSkillRequest;
    if (this.checkOverlapTime(bookingCosts)) {
      throw errorService.router.badRequest();
    }
    await skillService.findOne({ where: { id: skillId } });
    const provider = await providerRepository.findOne({
      where: {
        userId,
      },
    });
    if (!provider) {
      throw errorService.database.errorCustom(
        ERROR_MESSAGE.THIS_PROVIDER_DOES_NOT_EXISTED
      );
    }
    const preExistingProviderSkill = await this.repository.findOne({
      where: {
        providerId: provider.id,
        skillId,
      },
    });
    if (preExistingProviderSkill) {
      throw errorService.router.errorCustom(
        ERROR_MESSAGE.THIS_PROVIDER_SKILL_IS_EXISTED
      );
    }
    const countSkillProvider = await this.repository.countByProviderId(
      provider.id
    );
    const position = countSkillProvider + 1;
    return await prisma.$transaction(async (tx: PrismaTransation) => {
      const createProviderSkill = await this.repository.create(
        {
          skill: {
            connect: {
              id: skillId,
            },
          },
          provider: {
            connect: {
              id: provider.id,
            },
          },
          defaultCost,
          position,
        },
        tx
      );
      const bookingCostCreateManyInput = bookingCosts.map((item) => ({
        providerSkillId: createProviderSkill.id,
        ...item,
      }));
      await bookingCostRepository.createMany(
        bookingCostCreateManyInput,
        false,
        tx
      );
      return await this.repository.findOne(
        {
          where: {
            id: createProviderSkill.id,
          },
          include: {
            bookingCosts: true,
          },
        },
        tx
      );
    });
  }
  checkOverlapTime(data: Prisma.BookingCostUpdateInput[]) {
    for (let i = 0; i < data.length - 1; i++) {
      const valueStartTime = utilService.timeToMinutes(
        data[i]?.startTimeOfDay?.toString()!
      );
      const valueEndTime = utilService.timeToMinutes(
        data[i]?.endTimeOfDay?.toString()!
      );
      if (valueStartTime >= valueEndTime) return false;
      for (let j = i + 1; j < data.length; j++) {
        const itemStartTime = utilService.timeToMinutes(
          data[j]?.startTimeOfDay?.toString()!
        );
        const itemEndTime = utilService.timeToMinutes(
          data[j]?.endTimeOfDay?.toString()!
        );
        if (
          utilService.checkOverlap(
            valueStartTime,
            valueEndTime,
            itemStartTime,
            itemEndTime
          )
        ) {
          return true;
        }
      }
    }
    return false;
  }

  async findOne(query?: ICrudOptionPrisma): Promise<ProviderSkill | null> {
    return await this.repository.findOne(query);
  }

}
