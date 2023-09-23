import { ICrudOptionPrisma } from "@/services/base/basePrisma.service";
import { BasePrismaRepository } from "../base/basePrisma.repository";
import { BookingStatus, User } from "@prisma/client";
import moment from "moment";
import { config } from "@/configs";
import { IOptionFilterProvider } from "@/common/interface/IOptionFilterProvider.interface";

export class ProviderRepository extends BasePrismaRepository {
    async findAndCountAll(query?: ICrudOptionPrisma): Promise<{
        row: User[];
        count: number;
    }> {
        if (!query) query = {};
        if (!query.where) query.where = {};
        query.where.isProvider = true;
        const [row, count] = await this.prisma.$transaction([
            this.prisma.user.findMany(query),
            this.prisma.user.count({
                where: query?.where,
            }),
        ]);
        return {
            row,
            count,
        };
    }

    async filterAndCountAllProvider(
        option: IOptionFilterProvider,
        skip: number | undefined,
        take: number | undefined
    ) {
        const { endCost, gender, name, serviceId, startCost, order } = option;
        const nowTimehhmm = moment()
            .utcOffset(config.server.timezone)
            .format("HH:mm");
        const query = `
      WITH relevant_booking_costs AS (
        SELECT
          provider_service_id,
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
        pd.id,
        pd.slug,
        pd.name,
        pd.avatarUrl,
        pd.voiceUrl,
        pd.description,
        pd.createdAt,
        pd.updatedAt,
        pd.cost,
        pd.serviceId,
        pd.serviceName,
        pd.serviceImageUrl,
        pd.gender,
        pd.dob,
        pd.star
      FROM (
        SELECT DISTINCT ON (p.id)
            p.id,
            p.slug,
            p.name,
            p.avatar_url AS avatarUrl,
            p.created_at AS createdAt,
            p.updated_at AS updatedAt,
            COALESCE(bc.amount, ps.default_cost) AS cost,
            s.id AS serviceId,
            s.name AS serviceName,
            s.image_url AS serviceImageUrl,
            p.gender AS gender,
            p.dob AS dob,
            pc.voice_url AS voiceUrl,
            pc.description  AS description,
            CASE
            WHEN psf.avg_amount_star IS NOT NULL THEN
                CAST(psf.avg_amount_star AS FLOAT)
            ELSE
                0
            END AS star
        FROM
          "user" AS p
          INNER JOIN provider_service AS ps ON p.id = ps.provider_id
          INNER JOIN provider_config AS pc ON pc.user_id  = p.id
          INNER JOIN service AS s ON ps.service_id = s.id
          LEFT JOIN LATERAL (
            SELECT amount
            FROM relevant_booking_costs bc
            WHERE bc.provider_service_id = ps.id
            LIMIT 1
          ) bc ON true
          LEFT JOIN (
            SELECT
              psfps.id AS providerServiceId,
              AVG(f.amount_star) AS avg_amount_star
            FROM provider_service AS psfps
            LEFT JOIN (
              SELECT
                bh.provider_service_id,
                f.amount_star
              FROM booking_history AS bh
              LEFT JOIN feedback AS f ON bh.id = f.booking_id
              WHERE f.amount_star IS NOT NULL
            ) AS f ON psfps.id = f.provider_service_id
            GROUP BY psfps.id
          ) AS psf ON psf.providerServiceId = ps.id
          WHERE
            ps.deleted_at IS NULL
          ${
              startCost != undefined
                  ? `AND COALESCE(bc.amount, ps.default_cost) >= ${startCost}`
                  : ""
          }
          ${
              endCost != undefined
                  ? `AND COALESCE(bc.amount, ps.default_cost) < ${endCost}`
                  : ""
          }
          ${serviceId != undefined ? `AND s.id = '${serviceId}'` : ""}
          ${name != undefined ? `AND p.name like '%${name}%'` : ""}
          ${gender != undefined ? `AND u.gender = '${gender}'` : ""}
          AND bc.amount IS NULL
      ) AS pd
      `;
        let orderQueryRaw = "";
        if (order && order.length) {
            const orderClauses = order.map((orderItem) => {
                const key = Object.keys(orderItem)[0]!;
                const value = orderItem[key];
                const newKey = key; //utilService.camelCaseToSnakeCase(key);
                return `${newKey.toLocaleLowerCase()} ${value}`;
            });
            orderQueryRaw = orderClauses.join(", ");
        }
        const row = await this.prisma.$queryRawUnsafe(
            `
      ${query} 
      ${orderQueryRaw ? `ORDER BY ${orderQueryRaw}` : ""}
      ${take != undefined ? `LIMIT ${take}` : ""}
      ${skip != undefined ? `OFFSET ${skip}` : ""}
      `
        );
        const countResult: any = await this.prisma.$queryRawUnsafe(
            `SELECT COUNT(*) as count FROM (${query}) AS subquery`
        );
        return {
            row,
            count: Number(countResult[0].count),
        };
    }

    async filterAndCountAllHotProvider(
        intervalDays: number,
        skip: number | undefined,
        take: number | undefined
    ) {
        const getListIdsQuery = `
      SELECT
      p.id
      FROM
        "user" AS p
        LEFT JOIN provider_service AS ps ON p.id = ps.provider_id
        LEFT JOIN booking_history AS b ON ps.id = b.provider_service_id
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
    `)) as any[];
        const countResult: any = await this.prisma.$queryRawUnsafe(
            `SELECT COUNT(*) as count FROM (${getListIdsQuery}) AS subquery`
        );
        listIds.forEach((item, index) => {
            idsWhere += `'${item.id}' ${
                index < listIds.length - 1 ? "," : ""
            }\n`;
            idsOrder += `WHEN '${item.id}' THEN ${index + 1} \n`;
        });
        idsOrder += `ELSE ${listIds.length + 1}`;
        const nowTimehhmm = moment()
            .utcOffset(config.server.timezone)
            .format("HH:mm");
        const query = `
    SELECT *
    FROM (
        SELECT DISTINCT ON (p.id)
            p.id,
            p.slug,
            p.name,
            p.avatar_url AS avatarUrl,
            COALESCE(bc.amount, ps.default_cost) AS cost,
            s.id AS serviceId,
            s.name AS serviceName,
            s.image_url AS serviceImageUrl,
            pc.voice_url AS voiceUrl,
            pc.description  AS description,
            psf.avg_amount_star AS star
        FROM
            "user" AS p
            INNER JOIN provider_service AS ps ON p.id = ps.provider_id
            INNER JOIN provider_config AS pc ON pc.user_id  = p.id
            LEFT JOIN (
                SELECT
                    provider_service_id,
                    amount
                FROM
                    booking_cost
                WHERE
                    deleted_at IS NULL
                    AND start_time_of_day <= '${nowTimehhmm}'
                    AND end_time_of_day >= '${nowTimehhmm}'
                ORDER BY
                    amount ASC
            ) AS bc ON bc.provider_service_id = ps.id
            INNER JOIN service AS s ON ps.service_id = s.id
            LEFT JOIN (
              SELECT
                  psfps.id AS providerServiceId,
                  AVG(f.amount_star) AS avg_amount_star
              FROM provider_service AS psfps
              LEFT JOIN (
                  SELECT
                      bh.provider_service_id,
                      f.amount_star
                  FROM booking_history AS bh
                  LEFT JOIN feedback AS f ON bh.id = f.booking_id
                  WHERE f.amount_star IS NOT null
              ) AS f ON psfps.id = f.provider_service_id
              GROUP BY psfps.id
          ) AS psf ON psf.providerServiceId = ps.id
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
                            FROM provider_service AS psp
                            LEFT JOIN booking_cost AS bcp ON bcp.provider_service_id = psp.id
                            WHERE psp.provider_id = p.id
                            AND bcp.provider_service_id IS NOT NULL
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
  `;
        const row = await this.prisma.$queryRawUnsafe(query);
        return {
            row,
            count: Number(countResult[0].count),
        };
    }
}
