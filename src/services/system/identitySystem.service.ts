import { GetQrDepositRequest } from "@/common/requests/coin/getQrDeposit.request";
import { redisService, utilService } from "..";
import { config } from "@/configs";
import { AxiosInstance } from "axios";
import { EAdminRoleType } from "@/enums/adminRoleType.enum";
import { REDIS_PREFIX } from "../common/redis.service";

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
        await redisService.connect();

        const data = await redisService.get(`${REDIS_PREFIX.USER}:${userId}`);
        let result;

        if (!data) {
            result = (
                await this.fetchIdentityService().get(`system/user/${userId}`)
            ).data;
            console.log("result ===> ", result);
            if (result) {
                await redisService.set(
                    `${REDIS_PREFIX.USER}:${userId}`,
                    JSON.stringify(result)
                );
            }
            await redisService.disconnect();
        } else {
            result = JSON.parse(data);
        }
        await redisService.disconnect();
        return result;
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
