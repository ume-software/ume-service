import { config } from "@/configs";
import {
    BaseController,
    Request,
    Response,
} from "@/controllers/base/base.controller";
import prisma from "@/models/base.prisma";
import {
    buyCoinRequestRepository,
    coinHistoryRepository,
} from "@/repositories";
import { BuyCoinRequestStatus, CoinType } from "@prisma/client";
import crypto from "crypto";

export class MomoWebhookController extends BaseController {
    constructor() {
        super();

        this.path = "momo_webhook";
        this.customRouting();
    }

    customRouting() {
        this.router.get("", this.route(this.momoWebhook));
    }

    async momoWebhook(req: Request, res: Response) {
        let {
            partnerCode,
            orderId,
            requestId,
            amount,
            // orderInfo,
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
            `Momo - ${amount}` +
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

        let buyCoinRequest = await buyCoinRequestRepository.findOne({
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

                buyCoinRequest = await buyCoinRequestRepository.update(
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
                return buyCoinRequest;
            });

        res.send(
            '<script>window.open("", "_blank", "");window.close();</script>'
        );
    }
}
