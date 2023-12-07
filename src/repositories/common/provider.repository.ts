import { ICrudOptionPrisma } from "@/services/base/basePrisma.service";
import { BasePrismaRepository } from "../base/basePrisma.repository";
import { BookingStatus, ProviderStatus, User } from "@prisma/client";
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
        const {
            endCost,
            gender,
            name,
            serviceId,
            startCost,
            order,
            status,
            serviceAttributeValueIds,
            isOnline,
        } = option;
        const nowTimehhmm = moment()
            .utcOffset(config.server.timezone)
            .format("HH:mm");
        const querySql = `
        WITH relevant_booking_costs AS (
            SELECT
              bc.id AS booking_cost_id,
              bc.provider_service_id,
              bc.amount AS booking_cost
            FROM
              booking_cost AS bc
            WHERE
              bc.deleted_at IS NULL
              AND bc.start_time_of_day <= '${nowTimehhmm}'
              AND bc.end_time_of_day >= '${nowTimehhmm}'
          ),
          provider_data AS (
            SELECT DISTINCT ON (p.id)
              p.id,
              p.slug,
              p.name,
              p.avatar_url AS avatar_url,
              p.created_at AS created_at,
              p.updated_at AS updated_at,
              p.deleted_at AS deleted_at,
              p.is_online as is_online,
              COALESCE(rbc.booking_cost, ps.default_cost) AS cost,
              rbc.booking_cost_id,
              ps.id AS provider_service_id,
              ps."position" AS provider_service_position,
              s.slug AS service_slug,
              s.id   AS service_id,
              s.name AS service_name,
              s.image_url AS service_image_url,
              p.gender AS gender,
              p.dob AS dob,
              pc.voice_url AS voice_url,
              pc.description AS description,
              pc.status AS provider_status,
              CASE
                WHEN psf.avg_amount_star IS NOT NULL THEN
                  CAST(psf.avg_amount_star AS FLOAT)
                ELSE
                  0
              END AS star,
              ROW_NUMBER() OVER(PARTITION BY p.id ORDER BY ps."position") AS position_rank
            FROM
              "user" AS p
              INNER JOIN provider_service AS ps ON p.id = ps.provider_id
              INNER JOIN provider_config AS pc ON pc.user_id = p.id
              INNER JOIN service AS s ON ps.service_id = s.id
              LEFT JOIN relevant_booking_costs AS rbc ON rbc.provider_service_id = ps.id
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
              ${
                  serviceAttributeValueIds != undefined
                      ? `
              INNER JOIN provider_service_attribute AS psa ON ps.id = psa.provider_service_id
              INNER JOIN provider_service_attribute_value AS psav ON psa.id = psav.provider_service_attribute_id 
              `
                      : ""
              }
            WHERE
              ps.deleted_at IS NULL
              ${
                  serviceId != undefined
                      ? `AND (s.id = '${serviceId}' OR s.slug = '${serviceId}')`
                      : ""
              }
              ${name != undefined ? `AND p.name like '%${name}%'` : ""}
              ${gender != undefined ? `AND p.gender = '${gender}'` : ""}
              ${
                  serviceAttributeValueIds != undefined
                      ? `AND (psav.service_attribute_value_id IN (${serviceAttributeValueIds
                            .map((item) => `'${item}'`)
                            .join(", ")}))`
                      : ""
              }
              ${isOnline != undefined ? `AND p.is_online = ${isOnline}` : ""}
          ),
          list_attribute AS (
		    SELECT
		        ps.id AS provider_service_id,
		        CONCAT(
		            '[',
		            STRING_AGG(
		                CONCAT(
		                    '{"id":"', sa.id, '","viAttribute":"', sa.vi_attribute, '","attribute":"', sa.attribute, '","serviceAttributeValues":[',
		                    COALESCE(
		                        (
		                            SELECT STRING_AGG(
		                                CONCAT('{"id":"', sa.id, '","viValue":"', sav.vi_value, '","value":"', sav.value, '"}'), 
		                                ','
		                            )
		                            FROM provider_service_attribute_value psav
		                            JOIN service_attribute_value sav ON sav.id = psav.service_attribute_value_id
		                            WHERE psav.provider_service_attribute_id = psa.id
		                        ),
		                        ''
		                    ),
		                    ']}'
		                ),
		                ','
		            ),
		            ']'
		        ) AS list_attribute_value
		    FROM
		        provider_service ps
		    JOIN
		        provider_service_attribute psa ON psa.provider_service_id = ps.id
		    JOIN
		        service_attribute sa ON sa.id = psa.service_attribute_id
		    GROUP BY
		        ps.id, sa.vi_attribute, sa.attribute
		    )
          SELECT
            pd.id,
            pd.slug,
            pd.name,
            pd.avatar_url as avatar_url,
            pd.voice_url as voice_url,
            pd.description,
            pd.created_at as created_at,
            pd.updated_at as updated_at,
            pd.deleted_at as deleted_at,
            pd.cost,
            pd.provider_service_id as provider_service_id,
            pd.provider_service_position as provider_service_position,
            pd.service_slug as service_slug,
            pd.service_id as service_id,
            pd.service_name as service_name,
            pd.service_image_url as service_image_url,
            pd.gender,
            pd.dob,
            pd.star,
            pd.provider_status as provider_status,
            pd.is_online as is_online,
            la.list_attribute_value as list_attribute_value
          FROM provider_data AS pd
        LEFT JOIN
            list_attribute la ON pd.provider_service_id = la.provider_service_id
        WHERE pd.deleted_at IS NULL
        AND pd.position_rank = 1
          ${startCost != undefined ? `AND pd.cost >= ${startCost}` : ""}
          ${endCost != undefined ? `AND pd.cost < ${endCost}` : ""}
          ${status != status ? `AND pd.providerStatus = ${status}` : ""}
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
        const row: any[] = await this.prisma.$queryRawUnsafe(`
        ${querySql}
        ${orderQueryRaw ? `ORDER BY ${orderQueryRaw}` : ""}
        ${take != undefined ? `LIMIT ${take}` : ""}
        ${skip != undefined ? `OFFSET ${skip}` : ""}
         `);
        const countResult: any = await this.prisma.$queryRawUnsafe(
            `SELECT COUNT(*) as count FROM (${querySql}) AS subquery`
        );
        return {
            row: row.map((item) => {
                let serviceAttributes = [];
                try {
                    serviceAttributes = JSON.parse(
                        item.list_attribute_value
                    );
                } catch (e) {}
                return {
                    id: item.id,
                    slug: item.slug,
                    name: item.name,
                    avatarUrl: item.avatar_url,
                    voiceUrl: item.voice_url,
                    description: item.description,
                    createdAt: item.created_at,
                    updatedAt: item.updated_at,
                    deletedAt: item.deleted_at,
                    cost: item.cost,
                    serviceId: item.service_id,
                    providerServiceId: item.provider_service_id,
                    providerServicePosition: item.provider_service_position,
                    serviceSlug: item.service_slug,
                    serviceName: item.service_name,
                    serviceImageUrl: item.service_image_url,
                    gender: item.gender,
                    dob: item.dob,
                    star: item.star,
                    providerStatus: item.provider_status,
                    isOnline: item.is_online,
                    serviceAttributes,
                };
            }),
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
            LEFT JOIN provider_config AS pc ON p.id = pc.user_id 
            LEFT JOIN booking_history AS b ON ps.id = b.provider_service_id
          AND (b.status in ('${BookingStatus.PROVIDER_ACCEPT}','${BookingStatus.PROVIDER_FINISH_SOON}','${BookingStatus.USER_FINISH_SOON}'))
          AND b.created_at >= NOW() - INTERVAL '${intervalDays} days'
      WHERE
        pc.status NOT in ('${ProviderStatus.UN_ACTIVATED}','${ProviderStatus.STOPPED_ACCEPTING_BOOKING}')
        AND p.is_provider IS TRUE
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

        const querySql = `
            WITH relevant_booking_costs AS (
                SELECT
                    bc.id AS booking_cost_id,
                    bc.provider_service_id,
                    bc.amount AS booking_cost
                FROM
                    booking_cost AS bc
                WHERE
                    bc.deleted_at IS NULL
                    AND bc.start_time_of_day <= '${nowTimehhmm}'
                    AND bc.end_time_of_day >= '${nowTimehhmm}'
                ),
                provider_data AS (
                SELECT DISTINCT ON (p.id)
                    p.id,
                    p.slug,
                    p.name,
                    p.avatar_url AS avatar_url,
                    p.created_at AS created_at,
                    p.updated_at AS updated_at,
                    p.deleted_at AS deleted_at,
                    p.is_online as is_online,
                    ps.id AS provider_service_id,
                    ps."position" AS provider_service_position,
                    s.slug AS service_slug,
                    s.id   AS service_id,
                    s.name AS service_name,
                    s.image_url AS service_image_url,
                    COALESCE(rbc.booking_cost, ps.default_cost) AS cost,
                    rbc.booking_cost_id,
                    p.gender AS gender,
                    p.dob AS dob,
                    pc.voice_url AS voice_url,
                    pc.description AS description,
                    pc.status AS provider_status,
                    CASE
                        WHEN psf.avg_amount_star IS NOT NULL THEN
                            CAST(psf.avg_amount_star AS FLOAT)
                        ELSE
                            0
                    END AS star,
                    ROW_NUMBER() OVER(PARTITION BY p.id ORDER BY ps."position") AS position_rank
                FROM
                    "user" AS p
                    INNER JOIN provider_service AS ps ON p.id = ps.provider_id
                    INNER JOIN provider_config AS pc ON pc.user_id = p.id
                    INNER JOIN service AS s ON ps.service_id = s.id
                    LEFT JOIN relevant_booking_costs AS rbc ON rbc.provider_service_id = ps.id
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
                    AND p.id IN (
                        ${idsWhere}
                    )
                ),
                list_attribute AS (
                    SELECT
                        ps.id AS provider_service_id,
                        CONCAT(
                            '[',
                            STRING_AGG(
                                CONCAT(
                                    '{"id":"', sa.id, '","viAttribute":"', sa.vi_attribute, '","name":"', sa.attribute, '","serviceAttributeValues":[',
                                    COALESCE(
                                        (
                                            SELECT STRING_AGG(
                                                CONCAT('{"id":"', sa.id, '","viValue":"', sav.vi_value, '","value":"', sav.value, '"}'), 
                                                ','
                                            )
                                            FROM provider_service_attribute_value psav
                                            JOIN service_attribute_value sav ON sav.id = psav.service_attribute_value_id
                                            WHERE psav.provider_service_attribute_id = psa.id
                                        ),
                                        ''
                                    ),
                                    ']}'
                                ),
                                ','
                            ),
                            ']'
                        ) AS list_attribute_value
                    FROM
                        provider_service ps
                    JOIN
                        provider_service_attribute psa ON psa.provider_service_id = ps.id
                    JOIN
                        service_attribute sa ON sa.id = psa.service_attribute_id
                    GROUP BY
                        ps.id, sa.vi_attribute, sa.attribute
                )
                SELECT
                    pd.id,
                    pd.slug,
                    pd.name,
                    pd.avatar_url as avatar_url,
                    pd.voice_url as voice_url,
                    pd.description,
                    pd.created_at as created_at,
                    pd.updated_at as updated_at,
                    pd.deleted_at as deleted_at,
                    pd.cost,
                    pd.provider_service_id as provider_service_id,
                    pd.provider_service_position AS provider_service_position,
                    pd.service_slug as service_slug,
                    pd.service_id as service_id,
                    pd.service_name as service_name,
                    pd.service_image_url as service_image_url,
                    pd.gender,
                    pd.dob,
                    pd.star,
                    pd.provider_status as provider_status,
                    pd.is_online as is_online,
                    la.list_attribute_value as list_attribute_value
                FROM provider_data AS pd
                LEFT JOIN
		            list_attribute la ON pd.provider_service_id = la.provider_service_id
                WHERE 
                    pd.deleted_at IS NULL
                    AND pd.position_rank = 1;
         `;
        const row: any[] = await this.prisma.$queryRawUnsafe(querySql);
        return {
            row: row.map((item) => {
                let serviceAttributes = [];
                try {
                    serviceAttributes = JSON.parse(
                        item.list_attribute_value
                    );
                } catch (e) {}
                return {
                    id: item.id,
                    slug: item.slug,
                    name: item.name,
                    avatarUrl: item.avatar_url,
                    voiceUrl: item.voice_url,
                    description: item.description,
                    createdAt: item.created_at,
                    updatedAt: item.updated_at,
                    deletedAt: item.deleted_at,
                    cost: item.cost,
                    serviceId: item.service_id,
                    providerServiceId: item.provider_service_id,
                    providerServicePosition: item.provider_service_position,
                    serviceSlug: item.service_slug,
                    serviceName: item.service_name,
                    serviceImageUrl: item.service_image_url,
                    gender: item.gender,
                    dob: item.dob,
                    star: item.star,
                    providerStatus: item.provider_status,
                    isOnline: item.is_online,
                    serviceAttributes,
                };
            }),
            count: Number(countResult[0].count),
        };
    }
}
