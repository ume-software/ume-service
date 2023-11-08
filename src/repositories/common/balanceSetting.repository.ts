import {
    BalanceSettingType,
    PaymentSystemPlatform,
    UnitCurrency,
} from "@prisma/client";
import { BasePrismaRepository } from "../base/basePrisma.repository";

export class BalanceSettingRepository extends BasePrismaRepository {
    constructor() {
        super();
    }
    async getConvertBalanceToMoneyForWithdrawRate(unitCurrency: UnitCurrency) {
        const setting = await this.prisma.balanceSetting.findFirst({
            where: {
                balanceSettingType: BalanceSettingType.DEPOSIT,
                unitCurrency,
            },
        });
        let feePercentage = 0.001,
            surcharge = 0;
        if (setting) {
            feePercentage =
                setting.feePercentage != null
                    ? setting.feePercentage
                    : feePercentage;
            surcharge =
                setting.surcharge != null ? setting.surcharge : surcharge;
        }
        return {
            feePercentage,
            surcharge,
        };
    }
    async getConvertBalanceToMoneyForDepositRate(
        unitCurrency: UnitCurrency,
        paymentSystemPlatform: PaymentSystemPlatform
    ) {
        const setting = await this.prisma.balanceSetting.findFirst({
            where: {
                balanceSettingType: BalanceSettingType.DEPOSIT,
                paymentSystemPlatform,
                unitCurrency,
            },
        });
        let feePercentage = 0.001,
            surcharge = 0;
        if (setting) {
            feePercentage =
                setting.feePercentage != null
                    ? setting.feePercentage
                    : feePercentage;
            surcharge =
                setting.surcharge != null ? setting.surcharge : surcharge;
        }
        return {
            feePercentage,
            surcharge,
        };
    }

    calculateBalanceToMoneyForDeposit(
        amountMoney: number,
        option = {
            feePercentage: 0.001,
            surcharge: 0,
        }
    ) {
        const { feePercentage, surcharge } = option;
        const totalFee = Math.round(amountMoney * feePercentage + surcharge);
        return {
            amountMoney,
            totalFee,
            totalMoney: amountMoney + totalFee,
        };
    }

    calculateBalanceToMoneyForWithdraw(
        amountMoney: number,
        option = {
            feePercentage: 0.001,
            surcharge: 0,
        }
    ) {
        const { feePercentage, surcharge } = option;

        const totalFee = Math.round(amountMoney * feePercentage + surcharge);
        return {
            amountMoney,
            totalFee,
            totalMoney: amountMoney - totalFee,
        };
    }
    async convertBalanceToMoneyForWithdraw(
        amountBalance: number,
        unitCurrency: UnitCurrency
    ) {
        const option = await this.getConvertBalanceToMoneyForWithdrawRate(
            unitCurrency
        );
        return this.calculateBalanceToMoneyForWithdraw(amountBalance, option);
    }

    async convertBalanceToMoneyForDeposit(
        amountBalance: number,
        unitCurrency: UnitCurrency,
        paymentSystemPlatform: PaymentSystemPlatform
    ) {
        const option = await this.getConvertBalanceToMoneyForDepositRate(
            unitCurrency,
            paymentSystemPlatform
        );
        return this.calculateBalanceToMoneyForDeposit(amountBalance, option);
    }

    async calculateBalanceBookingForProvider(
        amountBalance: number
    ): Promise<number> {
        return await this.calculateForProvider(
            amountBalance,
            BalanceSettingType.PROVIDER_GET_MONEY_BOOKING
        );
    }

    async calculateBalanceDonateForProvider(
        amountBalance: number
    ): Promise<number> {
        return await this.calculateForProvider(
            amountBalance,
            BalanceSettingType.PROVIDER_GET_MONEY_DONATE
        );
    }

    private async calculateForProvider(
        amountBalance: number,
        coinType: BalanceSettingType
    ): Promise<number> {
        const setting = await this.prisma.balanceSetting.findFirst({
            where: {
                balanceSettingType: coinType,
            },
        });
        let feePercentage = 0.001,
            surcharge = 0;
        if (setting) {
            feePercentage =
                setting.feePercentage != null
                    ? setting.feePercentage
                    : feePercentage;
            surcharge =
                setting.surcharge != null ? setting.surcharge : surcharge;
        }
        const totalFee = amountBalance * feePercentage + surcharge;
        return amountBalance - totalFee;
    }
}
