import { GetQrDepositRequest } from "@/common/requests/getQrDeposit.request";
import { utilService } from "..";
import { config } from "@/configs";
import { AxiosInstance } from "axios";
import { EAdminRoleType } from "@/enums/adminRoleType.enum";

export class IdentitySystemService {
    private fetchIdentityService(): AxiosInstance {
        return utilService.fetch(config.service.identity.url, {
            headers: {
                common: {
                    key: Buffer.from(
                        config.service.identity.public_key
                    ).toString("base64"),
                },
            },
        });
    }
    async getInformation(userId: string) {
        console.log(
            "await this.fetchIdentityService().get(`system/user/${userId}`) ===> ",
            await this.fetchIdentityService().get(`system/user/${userId}`)
        );
        return (await this.fetchIdentityService().get(`system/user/${userId}`))
            .data;
    }

    async getListByUserIds(userIds: string[]) {
        return (
            await this.fetchIdentityService().post(
                "system/user/get-list-user-by-ids",
                {
                    ids: userIds,
                }
            )
        ).data;
    }

    async getListRolesByAdminIds(
        adminId: string
    ): Promise<{ roles: EAdminRoleType[] }> {
        return (
            await this.fetchIdentityService().get(
                `system/role/admin/${adminId}`
            )
        ).data;
    }

    async getQr(
        getQrRequest: GetQrDepositRequest & { tranferContent: string }
    ) {
        return (
            await this.fetchIdentityService().post(
                "system/qr-payment/get-qr",
                getQrRequest
            )
        ).data;
    }
}
