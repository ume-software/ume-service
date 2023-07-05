
import { CoinSettingType, PaymentSystemPlatform, UnitCurrency } from "@prisma/client";
import {
  BasePrismaRepository,
} from "../base/basePrisma.repository";

export class CoinSettingRepository extends BasePrismaRepository {
  constructor() {
    super();
  }

  async convertCoinToMoneyForBuyCoin(amountCoin: number, unitCurrency: UnitCurrency, paymentSystemPlatform: PaymentSystemPlatform) {
    const setting = await this.prisma.coinSetting.findFirst({
      where: {
        coinSettingType: CoinSettingType.BUY_COIN,
        paymentSystemPlatform,
        unitCurrency
      }
    });
    let conversionRateCoin = 0.001, feePercentage = 0.001, surcharge = 0;
    if (setting) {
      conversionRateCoin = setting.conversionRateCoin != null ? setting.conversionRateCoin : conversionRateCoin;
      feePercentage = setting.feePercentage != null ? setting.feePercentage : feePercentage;
      surcharge = setting.surcharge != null ? setting.surcharge : surcharge;
    }
    const amountMoney = Math.round(amountCoin / conversionRateCoin);
    const totalFee = Math.round(amountMoney * feePercentage + surcharge);
    return {
      amountMoney,
      totalFee,
      totalMoney: amountMoney + totalFee
    }
  }
  async calculateCoinBookingForProvider(amountCoin: number): Promise<number> {
    return await this.calculateForProvider(amountCoin, CoinSettingType.PROVIDER_GET_COIN_BOOKING)
  }

  async calculateCoinDonateForProvider(amountCoin: number): Promise<number> {
    return await this.calculateForProvider(amountCoin, CoinSettingType.PROVODER_GET_COIN_DONATE)
  }

  private async calculateForProvider(amountCoin: number, coinType: CoinSettingType): Promise<number> {
    const setting = await this.prisma.coinSetting.findFirst({
      where: {
        coinSettingType: coinType
      }
    });
    let feePercentage = 0.001, surcharge = 0;
    if (setting) {
      feePercentage = setting.feePercentage != null ? setting.feePercentage : feePercentage;
      surcharge = setting.surcharge != null ? setting.surcharge : surcharge;
    }
    const totalFee = amountCoin * feePercentage + surcharge;
    return amountCoin - totalFee
  }
}
