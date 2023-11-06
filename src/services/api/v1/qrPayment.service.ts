
import { GetQrDepositRequest } from "@/common/requests";
import { ESyntaxRegexPaymentQrSetting } from "@/enums/syntaxRegexPaymentQrSetting.enum";
import {
    adminPaymentSystemRepository,
    paymentQrSettingRepository,
} from "@/repositories";
import { errorService, utilService } from "@/services";

export class QrPaymentService {
    async getQrDeposit(getQrDepositRequest: GetQrDepositRequest) {
        const { amount, platform, transferContent } = getQrDepositRequest;
        const adminPaymentSystem =
            await adminPaymentSystemRepository.getRandomByPlatForm(platform);

        const paymentQrSetting = await paymentQrSettingRepository.findOne({
            where: {
                platform,
            },
        });
        if (!paymentQrSetting || !adminPaymentSystem) {
            throw errorService.recordNotFound();
        }
        const { platformAccount, beneficiary } = adminPaymentSystem;
        const { regex } = paymentQrSetting;
        const qrString = utilService.makeContent(regex!, {
            [ESyntaxRegexPaymentQrSetting.ACCOUNT_NUMBER]: platformAccount,
            [ESyntaxRegexPaymentQrSetting.BENEFICIARY_NAME]: beneficiary,
            [ESyntaxRegexPaymentQrSetting.TRANSFER_AMOUNT]: amount,
            [ESyntaxRegexPaymentQrSetting.TRANSFER_CONTENT]: transferContent,
        });

        return {
            qrString,
            adminPaymentSystem,
        };
    }
}
