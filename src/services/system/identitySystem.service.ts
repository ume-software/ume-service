import { GetQrDepositRequest } from "@/common/requests/getQrDeposit.request";
import { utilService } from "..";
import { config } from "@/configs";
import { AxiosInstance } from "axios";

export class IdentitySystemService {
    private fetchIdentityService(): AxiosInstance {
        return utilService.fetch(config.service.identity.url,
            {
                headers: {
                    common: {
                        key: Buffer.from(config.service.identity.public_key).toString('base64')
                    }
                }
            }
        )
    }
    async getInfomation(userId: string) {
        return (
            await this.fetchIdentityService().get(`system/user/${userId}`)
        ).data;
    }

    async getListByUserIds(bookerIds: string[]) {
        return (await this.fetchIdentityService().post("system/user/get-list-user-by-ids", {
            ids: bookerIds
        })).data;
    }
    async getQr(getQrRequest: (GetQrDepositRequest & { tranferContent: string })) {

        return (await this.fetchIdentityService().post("system/qr-payment/get-qr", getQrRequest)).data;
    }
}