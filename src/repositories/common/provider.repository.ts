import { ICrudOptionPrisma } from "@/services/base/basePrisma.service";
import { BasePrismaRepository, PrismaTransation } from "../base/basePrisma.repository";
import { BookingStatus, Prisma, Provider } from "@prisma/client";
import moment from "moment";
import { config } from "@/configs";
import { IOptionFilterProvider } from "@/common/interface/IOptionFilterProvider.interface";

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

  async filterAndCountAllProvider(option: IOptionFilterProvider, skip: number | undefined, take: number | undefined) {
    const { endCost, gender, name, skillId, startCost, order } = option;
    const orderByQuery = order?.map((obj: { [key: string]: string }) => {
      const key = Object.keys(obj)[0];
      const value = obj[key!]; 
      return `${key} ${value}`;
    }).join(', ');
    const nowTimehhmm = moment()
      .utcOffset(config.server.timezone)
      .format("HH:mm");
    const query = `
      WITH relevant_booking_costs AS (
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
      )
      SELECT
        id,
        userId,
        slug,
        name,
        avatarUrl,
        voiceUrl,
        description,
        cost,
        skillId,
        skillName,
        skillImageUrl,
        gender,
        dob,
        star
      FROM (
        SELECT DISTINCT ON (p.id)
          p.id,
          p.user_id AS userId,
          p.slug,
          p.name,
          p.avatar_url AS avatarUrl,
          p.voice_url AS voiceUrl,
          p.description,
          COALESCE(bc.amount, ps.default_cost) AS cost,
          s.id AS skillId,
          s.name AS skillName,
          s.image_url AS skillImageUrl,
          u.gender AS gender,
          u.dob AS dob,
          CASE
            WHEN  psf.avg_amount_star IS NOT NULL THEN
              CAST ( psf.avg_amount_star AS FLOAT)
            ELSE
              0
            END as start
        FROM
          provider AS p
        INNER JOIN provider_skill AS ps ON p.id = ps.provider_id
        INNER JOIN "user" AS u ON u.id = p.user_id
        INNER JOIN skill AS s ON ps.skill_id = s.id
        LEFT JOIN LATERAL (
          SELECT amount
          FROM relevant_booking_costs bc
          WHERE bc.provider_skill_id = ps.id
          LIMIT 1
        ) bc ON true
        LEFT JOIN (
          SELECT
            psfps.id AS providerSkillId,
            AVG(f.amount_star) AS avg_amount_star
          FROM provider_skill AS psfps
          LEFT JOIN (
            SELECT
              bh.provider_skill_id,
              f.amount_star
            FROM booking_history AS bh
            LEFT JOIN feedback AS f ON bh.id = f.booking_id
            WHERE f.amount_star IS NOT NULL
          ) AS f ON psfps.id = f.provider_skill_id
          GROUP BY psfps.id
        ) AS psf ON psf.providerSkillId = ps.id
        WHERE
          ps.deleted_at IS NULL
          ${startCost != undefined ? `AND COALESCE(bc.amount, ps.default_cost) >= ${startCost}` : ""}
          ${endCost != undefined ? `AND COALESCE(bc.amount, ps.default_cost) < ${endCost}` : ""}
          ${skillId != undefined ? `AND s.id = '${skillId}'` : ""}
          ${name != undefined ? `AND p.name like '%${name}%'` : ""}
          ${gender != undefined ? `AND u.gender = '${gender}'` : ""}
          AND bc.amount IS NULL
      ) AS pd
      `
    const row = await this.prisma.$queryRawUnsafe(
      `
      ${query} 
      ${order != undefined && order.length ? `ORDER BY ${orderByQuery}` : ""}
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

  async filterAndCountAllHotProvider(intervalDays: number, skip: number | undefined, take: number | undefined) {
    const getListIdsQuery = `
      SELECT
      p.id
      FROM
        provider AS p
        LEFT JOIN provider_skill AS ps ON p.id = ps.provider_id
        LEFT JOIN booking_history AS b ON ps.id = b.provider_skill_id
          AND (b.status = '${BookingStatus.PROVIDER_ACCEPT}' or b.status = '${BookingStatus.PROVIDER_FINISH_SOON}' or b.status = '${BookingStatus.USER_FINISH_SOON}')
          AND b.created_at >= NOW() - INTERVAL '${intervalDays} days'
      GROUP BY
        p.id
      ORDER BY
        COALESCE(COUNT(b.id), 0) DESC
    `;
    let idsWhere = "";
    let idsOrder = "";
    const listIds = (await this.prisma.$queryRawUnsafe(`
    ${getListIdsQuery} 
    ${take != undefined ? `LIMIT ${take}` : ""}
    ${skip != undefined ? `OFFSET ${skip}` : ""}
    `)) as any[]
    const countResult: any = await this.prisma.$queryRawUnsafe(`SELECT COUNT(*) as count FROM (${getListIdsQuery}) AS subquery`)
    listIds.forEach((item, index) => {
      idsWhere += `'${item.id}' ${index < listIds.length - 1 ? "," : ""}\n`;
      idsOrder += `WHEN '${item.id}' THEN ${index + 1} \n`
    })
    idsOrder += `ELSE ${listIds.length + 1}`
    const nowTimehhmm = moment()
      .utcOffset(config.server.timezone)
      .format("HH:mm");
    const query = `
    SELECT *
    FROM (
        SELECT DISTINCT ON (p.id)
            p.id,
            p.user_id AS userId,
            p.slug,
            p.name,
            p.avatar_url AS avatarUrl,
            p.voice_url AS voiceUrl,
            p.description,
            COALESCE(bc.amount, ps.default_cost) AS cost,
            s.id AS skillId,
            s.name AS skillName,
            s.image_url AS skillImageUrl,
            psf.avg_amount_star AS star
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
                ORDER BY
                    amount ASC
            ) AS bc ON bc.provider_skill_id = ps.id
            INNER JOIN skill AS s ON ps.skill_id = s.id
            LEFT JOIN (
              SELECT
                  psfps.id AS providerSkillId,
                  AVG(f.amount_star) AS avg_amount_star
              FROM provider_skill AS psfps
              LEFT JOIN (
                  SELECT
                      bh.provider_skill_id,
                      f.amount_star
                  FROM booking_history AS bh
                  LEFT JOIN feedback AS f ON bh.id = f.booking_id
                  WHERE f.amount_star IS NOT null
              ) AS f ON psfps.id = f.provider_skill_id
              GROUP BY psfps.id
          ) AS psf ON psf.providerSkillId = ps.id
        WHERE
            ps.deleted_at IS NULL
            AND p.id IN (
                ${idsWhere}
            )
            AND (
                (
                    CASE
                        WHEN (
                            SELECT COUNT(*)
                            FROM provider_skill AS psp
                            LEFT JOIN booking_cost AS bcp ON bcp.provider_skill_id = psp.id
                            WHERE psp.provider_id = p.id
                            AND bcp.provider_skill_id IS NOT NULL
                            AND bcp.start_time_of_day <= '${nowTimehhmm}'
                            AND bcp.end_time_of_day >= '${nowTimehhmm}'
                        ) > 0 THEN TRUE
                        ELSE FALSE
                    END
                ) IS true
                AND bc.amount IS NULL
            ) = false
    ) AS subquery
    ORDER BY
        CASE id
        ${idsOrder}
        END;
  `               
    const row = await this.prisma.$queryRawUnsafe(query)
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
