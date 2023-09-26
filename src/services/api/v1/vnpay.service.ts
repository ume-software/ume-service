import moment from "moment";
import { config } from "@/configs";

let querystring = require("qs");
let crypto = require("crypto");
interface VNPParams {
    vnp_Version: string;
    vnp_Command: string;
    vnp_TmnCode: string;
    vnp_Locale: string;
    vnp_CurrCode: string;
    vnp_TxnRef: string;
    vnp_OrderInfo: string;
    vnp_OrderType: string;
    vnp_Amount: number;
    vnp_ReturnUrl: string;
    vnp_CreateDate: string;
    vnp_BankCode?: string | null;
    vnp_SecureHash?: string;
    [string: string]: any;
}

export class VNPayService {
    createPaymentUrl(data: {
        amount: number;
        orderId: string;
        bankCode?: string;
        locale?: string;
    }): string {
        const createDate = moment()
            .utcOffset(config.server.timezone)
            .format("YYYYMMDDHHmmss");

        const tmnCode = config.vnpay.tmnCode!;
        const secretKey = config.vnpay.hashSecret!;
        let vnpUrl = config.vnpay.url!;
        const returnUrl = config.vnpay.returnUrl!;

        const currCode = "VND";
        let vnp_Params: VNPParams = {
            vnp_Version: "2.1.0",
            vnp_Command: "pay",
            vnp_TmnCode: tmnCode,
            vnp_Locale: data.locale ?? "vn",
            vnp_CurrCode: currCode,
            vnp_TxnRef: data.orderId,
            vnp_OrderInfo: "Thanh toan cho ma GD:" + data.orderId,
            vnp_OrderType: "other",
            vnp_Amount: data.amount * 100,
            vnp_ReturnUrl: returnUrl,
            vnp_CreateDate: createDate,
            vnp_IpAddr: "::1",
        };
        vnp_Params = this.sortObject(vnp_Params);
        if (data.bankCode) {
            vnp_Params.vnp_BankCode = data.bankCode;
        }

        let signData = querystring.stringify(vnp_Params, { encode: false });

        let hmac = crypto.createHmac("sha512", secretKey);
        let signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
        vnp_Params["vnp_SecureHash"] = signed;
        vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });
        console.log("vnpUrl ===> ", vnpUrl);

        return vnpUrl;
    }

    sortObject(obj: any) {
        let sorted: any = {};
        let str: any = [];
        let key;
        for (key in obj) {
            if (obj.hasOwnProperty(key)) {
                str.push(encodeURIComponent(key));
            }
        }
        str.sort();
        for (key = 0; key < str.length; key++) {
            sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(
                /%20/g,
                "+"
            );
        }
        return sorted;
    }
}
