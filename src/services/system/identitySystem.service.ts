import { GetQrDepositRequest } from "@/common/requests/coin/getQrDeposit.request";
import { redisService, utilService } from "..";
import { config } from "@/configs";
import { AxiosInstance } from "axios";
import { EAdminRoleType } from "@/enums/adminRoleType.enum";
import { REDIS_PREFIX } from "../common/redis.service";
import _ from "lodash";

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
            if (result) {
                await redisService.set(
                    `${REDIS_PREFIX.USER}:${userId}`,
                    JSON.stringify(result)
                );
            }
        } else {
            result = JSON.parse(data);
        }
        await redisService.disconnect();
        return result;
    }

    async getListByUserIds(userIds: Array<string>) {
        let results = [];
        const userIdsFromRedis: Array<string> = [];
        await redisService.connect();
        const promiseUserList = userIds.map((userId: string) =>
            redisService.get(`${REDIS_PREFIX.USER}:${userId}`)
        );
        const users = await Promise.all(promiseUserList);
        for (const userString of users) {
            if (userString) {
                const user = JSON.parse(userString);
                results.push(user);
                userIdsFromRedis.push(user?.id);
            }
        }
        const userIdsMissing = _.difference(userIds, userIdsFromRedis);
        if (userIdsMissing?.length) {
            const fetchDataUsers = (
                await this.fetchIdentityService().post(
                    "system/user/get-list-user-by-ids",
                    {
                        ids: userIds,
                    }
                )
            ).data;
            if (fetchDataUsers?.row?.length) {
                await Promise.all(
                    fetchDataUsers?.row.map((data: any) =>
                        redisService.set(
                            `${REDIS_PREFIX.USER}:${data.id}`,
                            JSON.stringify(data)
                        )
                    )
                );
                results = [...results, ...fetchDataUsers?.row];
            }
        }
        await redisService.disconnect();
        return results;
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
        getQrRequest: GetQrDepositRequest & { transferContent: string }
    ) {
        return (
            await this.fetchIdentityService().post(
                "system/qr-payment/get-qr",
                getQrRequest
            )
        ).data;
    }
}
