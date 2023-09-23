import { ICrudOptionPrisma } from "@/services/base/basePrisma.service";
import {
    BasePrismaRepository,
    PrismaTransaction,
} from "../base/basePrisma.repository";
import { Prisma, Voucher } from "@prisma/client";

export class VoucherRepository extends BasePrismaRepository {
 

    async findAndCountAll(query?: ICrudOptionPrisma): Promise<{
        row: Voucher[];
        count: number;
    }> {
        const [row, count] = await this.prisma.$transaction([
            this.prisma.voucher.findMany(query),
            this.prisma.voucher.count({
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
        voucherUpdateInput: Prisma.VoucherUpdateInput,
        tx: PrismaTransaction = this.prisma
    ) {
        return await tx.voucher.update({
            data: voucherUpdateInput,
            where: { id },
        });
    }

    async update(
        voucherUpdateInput: Prisma.VoucherUpdateInput,
        query: ICrudOptionPrisma,
        tx: PrismaTransaction = this.prisma
    ) {
        return await tx.voucher.update({
            data: voucherUpdateInput,
            where: query.where,
        });
    }

    async create(
        VoucherCreateInput: Prisma.VoucherCreateInput,
        tx: PrismaTransaction = this.prisma
    ): Promise<Voucher> {
        return await tx.voucher.create({ data: VoucherCreateInput });
    }

    async findOne(
        query?: ICrudOptionPrisma,
        tx: PrismaTransaction = this.prisma
    ): Promise<Voucher | null> {
        return await tx.voucher.findFirst(query);
    }

    async findById(
        id: string,
        tx: PrismaTransaction = this.prisma
    ): Promise<Voucher | null> {
        return await tx.voucher.findFirst({
            where: {
                id,
            },
        });
    }

    async findMany(
        query?: ICrudOptionPrisma,
        tx: PrismaTransaction = this.prisma
    ): Promise<Voucher[]> {
        return await tx.voucher.findMany(query);
    }

    async deleteById(
        id: string,
        tx: PrismaTransaction = this.prisma
    ): Promise<Voucher> {
        return await tx.voucher.delete({ where: { id } });
    }

    async deleteMany(
        voucherWhereInput: Prisma.VoucherWhereInput,
        tx: PrismaTransaction = this.prisma
    ): Promise<Prisma.BatchPayload> {
        return await tx.voucher.deleteMany({
            where: voucherWhereInput,
        });
    }

    async findVoucherByBookerId(
        bookerId: string,
        providerId?: string,
        limit?: number,
        skip?: number,
        tx: PrismaTransaction = this.prisma
    ) {
        const result = await tx.$queryRaw<Voucher>`
          SELECT V.*
          FROM voucher V
          WHERE (${providerId ?? null} IS NULL OR V.provider_id = ${
            providerId ?? null
        })
            AND V.start_date <= NOW() -- Check if the voucher is valid (start_date)
            AND (V.end_date IS NULL OR V.end_date >= NOW()) -- Check if the voucher is valid (end_date)
            AND V.deleted_at IS NULL -- Check if the voucher is not deleted
            AND EXTRACT(ISODOW FROM NOW()) = ANY(V.apply_iso_day_of_week) -- Check if the current day of the week is in apply_iso_day_of_week
            AND (
              (
                SELECT COUNT(*)
                FROM voucher_redeemed_booking VRB
                WHERE VRB.voucher_id = V.id
                  AND VRB.booker_id = ${bookerId}
                  AND DATE(VRB.created_at) = CURRENT_DATE
                  AND VRB.deleted_at IS NULL -- Check if the voucher_redeemed_booking is not deleted
              ) < V.daily_usage_limit_per_booker  OR V.daily_usage_limit_per_booker IS NULL
            ) -- Check if the number of vouchers used today is less than the daily usage limit or unlimited if no limit is set
            AND (
              (
                SELECT COUNT(*)
                FROM voucher_redeemed_booking VRB
                WHERE VRB.voucher_id = V.id
                  AND VRB.booker_id = ${bookerId}
                  AND VRB.deleted_at IS NULL -- Check if the voucher_redeemed_booking is not deleted
              ) < V.number_usable_per_booker OR V.number_usable_per_booker IS NULL
            ) -- Check if the number of vouchers used by the booker is less than the number usable per booker or unlimited if no limit is set
            AND (
              (
                SELECT COUNT(*)
                FROM voucher_redeemed_booking VRB
                WHERE VRB.voucher_id = V.id
                  AND VRB.deleted_at IS NULL -- Check if the voucher_redeemed_booking is not deleted
              ) < V.number_issued OR V.number_issued IS NULL
            ) -- Check if the total number of vouchers redeemed for the voucher is less than the number issued or unlimited if no limit is set
            AND (
              (
                SELECT COUNT(*)
                FROM voucher_redeemed_booking VRB
                WHERE VRB.voucher_id = V.id
                  AND DATE(VRB.created_at) = CURRENT_DATE
                  AND VRB.deleted_at IS NULL -- Check if the voucher_redeemed_booking is not deleted
              ) < V.daily_number_issued OR V.daily_number_issued IS NULL
            ) -- Check if the number of vouchers redeemed today for the voucher is less than the daily number issued or unlimited if no limit is set

            AND V.is_activated = true -- Check if the voucher is activated
            AND (
              V.recipient_type = 'ALL' -- Apply for all booker (no need to check if the booker has accepted or completed bookings)
              OR (
                V.recipient_type = 'SELECTIVE_BOOKER' -- Check if booker_id is in the array selective_booker_id
                AND (${bookerId} = ANY(V.selective_booker_id) )
              )
              OR (
                V.recipient_type = 'PREVIOUS_BOOKING' -- Booker needs to have accepted or completed bookings
                AND EXISTS (
                  SELECT 1
                  FROM booking_history BH
                  WHERE BH.booker_id = ${bookerId}
                    AND BH.status IN ('PROVIDER_ACCEPT', 'PROVIDER_FINISH_SOON', 'USER_FINISH_SOON')
                    AND BH.provider_service_id IN (
                      SELECT PS.id
                      FROM provider_service PS
                      WHERE PS.provider_id = V.provider_id
                    )
                    AND BH.deleted_at IS NULL -- Check if the booking history is not deleted
                )
              )
              OR (
                V.recipient_type = 'FIRST_TIME_BOOKING' -- Booker needs to have not accepted or completed bookings
                AND NOT EXISTS (
                  SELECT 1
                  FROM booking_history BH
                  WHERE BH.booker_id = ${bookerId}
                    AND BH.status IN ('PROVIDER_ACCEPT', 'PROVIDER_FINISH_SOON', 'USER_FINISH_SOON')
                    AND BH.provider_service_id IN (
                      SELECT PS.id
                      FROM provider_service PS
                      WHERE PS.provider_id = V.provider_id
                    )
                    AND BH.deleted_at IS NULL -- Check if the booking history is not deleted
                )
              )
              OR (
                V.recipient_type = 'TOP_5_BOOKER' -- Booker needs to be in the top 5 bookers with the most total booking time in the past month
                AND ${bookerId} IN (
                  SELECT BH.booker_id
                  FROM booking_history BH
                  WHERE BH.status IN ('PROVIDER_ACCEPT', 'PROVIDER_FINISH_SOON', 'USER_FINISH_SOON')
                    AND BH.created_at >= NOW() - INTERVAL '1 month'
                    AND BH.deleted_at IS NULL -- Check if the booking history is not deleted
                  GROUP BY BH.booker_id
                  ORDER BY SUM(BH.booking_period) DESC
                  LIMIT 5
                )
              )
              OR (
                V.recipient_type = 'TOP_10_BOOKER' -- Booker needs to be in the top 10 bookers with the most total booking time in the past month
                AND ${bookerId} IN (
                  SELECT BH.booker_id
                  FROM booking_history BH
                  WHERE BH.status IN ('PROVIDER_ACCEPT', 'PROVIDER_FINISH_SOON', 'USER_FINISH_SOON')
                    AND BH.created_at >= NOW() - INTERVAL '1 month'
                    AND BH.deleted_at IS NULL -- Check if the booking history is not deleted
                  GROUP BY BH.booker_id
                  ORDER BY SUM(BH.booking_period) DESC
                  LIMIT 10
                )
              )
            )
          LIMIT ${limit ?? null}
          OFFSET ${skip ?? null};
      `;

        return result;
    }
}
