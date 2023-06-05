
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

}
