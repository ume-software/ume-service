import { ICrudOptionPrisma } from "@/services/base/basePrisma.service";
import { BasePrismaRepository, PrismaTransation } from "../base/basePrisma.repository";
import { Prisma, Provider } from "@prisma/client";
import moment from "moment";
import { config } from "@/configs";

export class ProviderRepository extends BasePrismaRepository {
  constructor() {
    super();
  }

  async findAndCountAll(query?: ICrudOptionPrisma): Promise<{
    row: Provider[];
    count: number;
  }> {
    const [row, count] = await this.prisma.$transaction([
      this.prisma.provider.findMany(query),
      this.prisma.provider.count({
        where: query?.where,
      }),
    ]);
    return {
      row,
      count,
    };
  }

  async filterAndCountAllProvider(skillId: string | undefined, startCost: number | undefined, endCost: number | undefined, skip: number | undefined, take: number | undefined) {
    const nowTimehhmm = moment()
      .utcOffset(config.server.timezone)
      .format("HH:mm");
    const query = `
        SELECT DISTINCT ON (p.id)
          p.id,
          p.user_id AS userId,
          p.slug,
          p.name,
          p.avatar_url AS avatarUrl,
          p.voice_url AS voiceUrl,
          p.description,
          COALESCE(bc.amount,ps.default_cost) AS cost,
          s.id AS skillId,
          s.name AS skillName,
          s.image_url AS skillImageUrl
      FROM
        provider AS p
        INNER JOIN provider_skill AS ps ON p.id = ps.provider_id
        LEFT JOIN (
          SELECT
            provider_skill_id,
            amount
          FROM
            booking_cost
          WHERE
            deleted_at IS NULL
            AND start_time_of_day <= '${nowTimehhmm}'
            AND end_time_of_day >= '${nowTimehhmm}'
            ${startCost != undefined ? `AND amount >= ${startCost}` : ""}
            ${endCost != undefined ? `AND amount < ${endCost}` : ""}
          ORDER BY
            amount ASC
        ) AS bc ON bc.provider_skill_id = ps.id
        INNER JOIN skill AS s ON ps.skill_id = s.id
      WHERE
        ps.deleted_at IS NULL
        ${startCost != undefined ? `AND COALESCE(bc.amount, ps.default_cost) >= ${startCost}` : ""}
        ${endCost != undefined ? `AND COALESCE(bc.amount, ps.default_cost) < ${endCost}` : ""}
        ${skillId != undefined ? `AND s.id = '${skillId}'` : ""}
      
     
        AND ((CASE WHEN (SELECT COUNT(*) FROM provider_skill AS psp LEFT JOIN booking_cost AS bcp ON bcp.provider_skill_id = psp.id WHERE psp.provider_id = p.id AND bcp.provider_skill_id IS NOT NULL AND bcp.start_time_of_day <= '${nowTimehhmm}' AND bcp.end_time_of_day >= '${nowTimehhmm}') > 0 THEN TRUE ELSE FALSE END) IS true and bc.amount IS NULL ) = false
      ORDER BY
        p.id,
        p.created_at
      `

    const row = await this.prisma.$queryRawUnsafe(
      `
      ${query} 
      ${take != undefined ? `LIMIT ${take}` : ""}
      ${skip != undefined ? `OFFSET ${skip}` : ""}
      `
    )
    const countResult: any = await this.prisma.$queryRawUnsafe(`SELECT COUNT(*) as count FROM (${query}) AS subquery`)
    return {
      row,
      count: Number(countResult[0].count)
    }
  }
  async getByIdOrSlug(slug: string): Promise<Provider | null> {
    const nowTimehhmm = moment()
      .utcOffset(config.server.timezone)
      .format("HH:mm");
    return await this.prisma.provider.findFirst({
      where: {
        OR: [{
          id: slug
        },
        {
          slug: slug
        }]
      },
      include: {
        providerSkills: {
          where: {
            deletedAt: null,
            skill: {
              deletedAt: null
            }
          },
          include: {
            bookingCosts: {
              where: {
                deletedAt: null,
                startTimeOfDay: {
                  lte: nowTimehhmm
                },
                endTimeOfDay: {
                  gte: nowTimehhmm
                },
              },
              take: 1
            },
            skill: true
          },
          orderBy: {
            position: "asc"
          }
        },
      }
    })

  }



  async updateById(
    id: string,
    bookingCostUpdateInput: Prisma.BookingCostUpdateInput,
    tx: PrismaTransation = this.prisma
  ): Promise<Provider> {
    return await tx.provider.update({
      data: bookingCostUpdateInput,
      where: { id },
    });
  }

  async updateMany(
    providerUpdateInput: Prisma.ProviderUpdateInput,
    query: ICrudOptionPrisma,
    tx: PrismaTransation = this.prisma
  ): Promise<Prisma.PrismaPromise<Prisma.BatchPayload>> {
    return await tx.provider.updateMany({
      data: providerUpdateInput,
      where: query.where,
    });
  }

  async create(
    providerCreateInput: Prisma.ProviderCreateInput,
    tx: PrismaTransation = this.prisma
  ): Promise<Provider> {
    return await tx.provider.create({ data: providerCreateInput });
  }

  async findOne(
    query?: ICrudOptionPrisma,
    tx: PrismaTransation = this.prisma
  ): Promise<Provider | null> {
    return await tx.provider.findFirst(query);
  }

  async findMany(
    query?: ICrudOptionPrisma,
    tx: PrismaTransation = this.prisma
  ): Promise<Provider[]> {
    return await tx.provider.findMany(query);
  }

  async deleteById(
    id: string,
    tx: PrismaTransation = this.prisma
  ): Promise<Provider> {
    return await tx.provider.delete({ where: { id } });
  }

  async deleteMany(
    providerWhereInput: Prisma.ProviderWhereInput,
    tx: PrismaTransation = this.prisma
  ): Promise<Prisma.BatchPayload> {
    return await tx.provider.deleteMany({ where: providerWhereInput });
  }
}
