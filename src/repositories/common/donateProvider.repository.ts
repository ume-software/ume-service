import { ICrudOptionPrisma } from "@/services/base/basePrisma.service";
import {
  BasePrismaRepository,
  PrismaTransaction,
} from "../base/basePrisma.repository";
import { Prisma, DonateProvider } from "@prisma/client";
import { ETopDonateDuration } from "@/enums/topDonateDuration.enum";
import moment from "moment";
import { config } from "@/configs";

export class DonateProviderRepository extends BasePrismaRepository {
  private tableName = "donate_provider"
  constructor() {
    super();
  }

  async topDonateProvider(duration: ETopDonateDuration, take: number) {
    const regex = /(\d+)([A-Za-z]+)/;
    const matches = duration.match(regex)!;
    const unitOfTime: any = matches[2];
    const time = moment().utcOffset(config.server.timezone).startOf(unitOfTime).toDate();
    const topDonateProvider = await this.prisma.donateProvider.groupBy({
      by: ['providerId'],
      _count: {
        actualReceivingAmount: true,
      },
      _sum: {
        actualReceivingAmount: true,
      },
      orderBy: {
        _sum: {
          actualReceivingAmount: 'desc',
        },
      },
      where: {
        createdAt: {
          gte: time
        }
      },
      take
    });
    return topDonateProvider;
  }
  async topUserDonate(duration: ETopDonateDuration, take: number) {
    const regex = /(\d+)([A-Za-z]+)/;
    const matches = duration.match(regex)!;
    const unitOfTime: any = matches[2];
    const time = moment().utcOffset(config.server.timezone).startOf(unitOfTime).toDate();
    const topDonateProvider = await this.prisma.donateProvider.groupBy({
      by: ['userId'],
      _count: {
        donateAmount: true,
      },
      _sum: {
        donateAmount: true,
      },
      orderBy: {
        _sum: {
          donateAmount: 'desc',
        },
      },
      where: {
        createdAt: {
          gte: time
        }
      },
      take
    });
    return topDonateProvider;
  }

  async findAndCountAll(query?: ICrudOptionPrisma): Promise<{
    row: DonateProvider[];
    count: number;
  }> {
    const [row, count] = await this.prisma.$transaction([
      this.prisma.donateProvider.findMany(query),
      this.prisma.donateProvider.count({
        where: query?.where,
      }),
    ]);
    return {
      row,
      count,
    };
  }

  async updateById(
    id: string,
    donateProviderUpdateInput: Prisma.DonateProviderUpdateInput,
    tx: PrismaTransaction = this.prisma
  ) {
    return await tx.donateProvider.update({ data: donateProviderUpdateInput, where: { id } });
  }

  async update(
    donateProviderUpdateInput: Prisma.DonateProviderUpdateInput,
    query: ICrudOptionPrisma,
    tx: PrismaTransaction = this.prisma
  ) {
    return await tx.donateProvider.update({
      data: donateProviderUpdateInput,
      where: query.where,
    });
  }

  async create(
    donateProviderCreateInput: Prisma.DonateProviderCreateInput,
    tx: PrismaTransaction = this.prisma
  ): Promise<DonateProvider> {
    return await tx.donateProvider.create({ data: donateProviderCreateInput });
  }

  async findOne(
    query?: ICrudOptionPrisma,
    tx: PrismaTransaction = this.prisma
  ): Promise<DonateProvider | null> {
    return await tx.donateProvider.findFirst(query);
  }

  async findMany(
    query?: ICrudOptionPrisma,
    tx: PrismaTransaction = this.prisma
  ): Promise<DonateProvider[]> {
    return await tx.donateProvider.findMany(query);
  }

  async deleteById(
    id: string,
    tx: PrismaTransaction = this.prisma
  ): Promise<DonateProvider> {
    return await tx.donateProvider.delete({ where: { id } });
  }

  async deleteMany(
    donateProviderWhereInput: Prisma.DonateProviderWhereInput,
    tx: PrismaTransaction = this.prisma
  ): Promise<Prisma.BatchPayload> {
    return await tx.donateProvider.deleteMany({ where: donateProviderWhereInput });
  }

  async destroyById(
    id: string
  ) {
    const query = `DELETE FROM ${this.tableName} WHERE id='${id}';`
    return await this.prisma.$queryRawUnsafe(query);
  }
}
