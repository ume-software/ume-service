import { config } from "@/configs";
import axios from "axios";
import crypto from "crypto";

export class MomoService {
    async createPaymentUrl(data: { amount: number; orderId: string }) {
        const partnerCode = config.momo.partnerCode!;
        const accessKey = config.momo.accessKey!;
        const secretkey = config.momo.secretKey!;
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
            data.orderId +
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
        console.log("rawSignature ===> ", rawSignature);
        const signature = crypto
            .createHmac("sha256", secretkey)
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
}
