import { ICrudOptionPrisma } from "@/services/base/basePrisma.service";
import { BasePrismaRepository } from "../base/basePrisma.repository"
import { Prisma, PaymentQrSetting } from "@prisma/client";


export class PaymentQrSettingRepository extends BasePrismaRepository {
    constructor() {
        super()
    }


    async findAndCountAll(query?: ICrudOptionPrisma): Promise<{
        row: PaymentQrSetting[];
        count: number;
    }> {
        const [row, count] = await this.prisma.$transaction([
            this.prisma.paymentQrSetting.findMany(query as any),
            this.prisma.paymentQrSetting.count({
                where: query?.where
            })
        ]);
        return {
            row,
            count
        }

    }

    async delete(paymentQrSettingWhereInput: Prisma.PaymentQrSettingWhereInput): Promise<Prisma.BatchPayload> {
        return await this.prisma.paymentQrSetting.deleteMany({ where: paymentQrSettingWhereInput })
    }

    async updateById(id: string, paymentQrSettingUpdateInput: Prisma.PaymentQrSettingUpdateInput) {
        return await this.prisma.paymentQrSetting.update({ data: paymentQrSettingUpdateInput, where: { id } })
    }

    async update(paymentQrSettingUpdateInput: Prisma.PaymentQrSettingUpdateInput, query: ICrudOptionPrisma) {
        return await this.prisma.paymentQrSetting.update({ data: paymentQrSettingUpdateInput, where: query.where })
    }


    async create(paymentQrSettingCreateInput: Prisma.PaymentQrSettingCreateInput): Promise<PaymentQrSetting> {
        return await this.prisma.$transaction(async (tx) => {
            const PaymentQrSetting = await tx.paymentQrSetting.create({ data: paymentQrSettingCreateInput })
            return PaymentQrSetting;
        })

    }

    async findOne(query?: ICrudOptionPrisma): Promise<PaymentQrSetting | null> {
        return await this.prisma.paymentQrSetting.findFirst(query as any)
    }


    async findMany(query?: ICrudOptionPrisma): Promise<PaymentQrSetting[]> {
        return await this.prisma.paymentQrSetting.findMany(query as any)
    }

    async deleteById(id: string): Promise<PaymentQrSetting> {
        return await this.prisma.paymentQrSetting.delete({ where: { id } })
    }

    async deleteMany(paymentQrSettingWhereInput: Prisma.PaymentQrSettingWhereInput): Promise<Prisma.BatchPayload> {
        return await this.prisma.paymentQrSetting.deleteMany({ where: paymentQrSettingWhereInput })
    }

}