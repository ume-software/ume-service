import { config } from "@/configs";
import { Request } from "@/controllers/base/base.controller";
import axios from "axios";
import prisma from "@/models/base.prisma";
import {
    buyCoinRequestRepository,
    coinHistoryRepository,
} from "@/repositories";
import { BuyCoinRequestStatus, CoinType } from "@prisma/client";
import crypto from "crypto";
import { bcryptService } from "@/services";
export class MomoService {
    async createPaymentUrl(data: { amount: number; orderId: string }) {
        const partnerCode = config.momo.partnerCode!;
        const accessKey = config.momo.accessKey!;
        const secretKey = config.momo.secretKey!;
        const orderInfo = `Momo - UME`;
        const redirectUrl = config.momo.redirectUrl!;
        const ipnUrl = config.momo.inpUrl!;
        const requestType = "captureWallet";
        const extraData = bcryptService.hashData(data.orderId);
        const rawSignature =
            "accessKey=" +
            accessKey +
            "&amount=" +
            data.amount +
            "&extraData=" +
            extraData +
            "&ipnUrl=" +
            ipnUrl +
            "&orderId=" +
            data.orderId +
            "&orderInfo=" +
            orderInfo +
            "&partnerCode=" +
            partnerCode +
            "&redirectUrl=" +
            redirectUrl +
            "&requestId=" +
            data.orderId +
            "&requestType=" +
            requestType;
        const signature = crypto
            .createHmac("sha256", secretKey)
            .update(rawSignature)
            .digest("hex");

        const requestBody = {
            partnerCode: partnerCode,
            accessKey: accessKey,
            requestId: data.orderId,
            amount: data.amount,
            orderId: data.orderId,
            orderInfo: orderInfo,
            redirectUrl: redirectUrl,
            ipnUrl: ipnUrl,
            extraData: data.orderId,
            requestType: requestType,
            signature: signature,
            lang: "vi",
        };

        const response = await axios.post(
            `${config.momo.api}/v2/gateway/api/create`,
            requestBody,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );
        return response.data.payUrl;
    }

    async handleWebhook(req: Request) {
        let {
            orderId,
            resultCode,
            message,
            extraData,
        } = req.query as { [key: string]: string };

        const buyCoinRequest = await buyCoinRequestRepository.findOne({
            where: {
                transactionCode: orderId,
            },
        });
        if (
            ((await bcryptService.compareDataWithHash(orderId!, extraData!)) &&
                buyCoinRequest &&
                resultCode == "0",
            [
                BuyCoinRequestStatus.INIT,
                BuyCoinRequestStatus.PENDING,
                BuyCoinRequestStatus.USER_NOTICES_PAID,
            ].includes(buyCoinRequest?.status as any))
        )
            await prisma.$transaction(async (tx) => {
                await coinHistoryRepository.create(
                    {
                        user: {
                            connect: {
                                id: buyCoinRequest?.requesterId!,
                            },
                        },
                        amount: buyCoinRequest?.amountCoin!,
                        coinType: CoinType.BUY_COIN,
                    },
                    tx
                );

                return await buyCoinRequestRepository.update(
                    {
                        status: BuyCoinRequestStatus.APPROVED,
                    },
                    {
                        where: {
                            id: buyCoinRequest?.id,
                        },
                    },
                    tx
                );
            });

        return {
            message,
            resultCode,
        };
    }
}
