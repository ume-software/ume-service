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
export class MomoService {
    async createPaymentUrl(data: {
        amount: number;
        orderId: string;
        userId: string;
    }) {
        const partnerCode = config.momo.partnerCode!;
        const accessKey = config.momo.accessKey!;
        const secretKey = config.momo.secretKey!;
        const orderInfo = `Momo - ${data.amount}`;
        const redirectUrl = config.momo.redirectUrl!;
        const ipnUrl = config.momo.inpUrl!;
        const requestType = "captureWallet";
        const rawSignature =
            "accessKey=" +
            accessKey +
            "&amount=" +
            data.amount +
            "&extraData=" +
            JSON.stringify({
                userId: data.userId,
            }) +
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
            lang: "en",
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
            partnerCode,
            orderId,
            requestId,
            amount,
            orderInfo,
            // orderType,
            // transId,
            // resultCode,
            // message,
            // payType,
            // responseTime,
            extraData,
            signature,
        } = req.query as { [key: string]: string };
        const accessKey = config.momo.accessKey!;
        const secretkey = config.momo.secretKey!;
        const redirectUrl = config.momo.redirectUrl!;
        const ipnUrl = config.momo.inpUrl!;
        const requestType = "captureWallet";
        const rawSignature =
            "accessKey=" +
            accessKey +
            "&amount=" +
            amount +
            "&extraData=" +
            extraData +
            "&ipnUrl=" +
            ipnUrl +
            "&orderId=" +
            orderId +
            "&orderInfo=" +
            orderInfo +
            "&partnerCode=" +
            partnerCode +
            "&redirectUrl=" +
            redirectUrl +
            "&requestId=" +
            requestId +
            "&requestType=" +
            requestType;
        const signatureCheck = crypto
            .createHmac("sha256", secretkey)
            .update(rawSignature)
            .digest("hex");

        const buyCoinRequest = await buyCoinRequestRepository.findOne({
            where: {
                transactionCode: orderId,
            },
        });
        if (
            signatureCheck == signature &&
            buyCoinRequest &&
            [
                BuyCoinRequestStatus.INIT,
                BuyCoinRequestStatus.PENDING,
                BuyCoinRequestStatus.USER_NOTICES_PAID,
            ].includes(buyCoinRequest.status as any)
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
            signatureCheck,
            signature,
            rawSignature,
        };
    }
}
