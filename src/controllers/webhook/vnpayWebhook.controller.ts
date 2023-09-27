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
import { vnpayService } from "@/services";
import { BuyCoinRequestStatus, CoinType } from "@prisma/client";
// const responseCodeTable = {
//     "00": {
//         vn: "Giao dịch thành công",
//         en: "Approved",
//     },
//     "01": {
//         vn: "Giao dịch đã tồn tại",
//         en: "Transaction is already exist",
//     },
//     "02": {
//         vn: "Merchant không hợp lệ (kiểm tra lại vnp_TmnCode)",
//         en: "Invalid merchant (check vnp_TmnCode value)",
//     },
//     "03": {
//         vn: "Dữ liệu gửi sang không đúng định dạng",
//         en: "Sent data is not in the right format",
//     },
//     "04": {
//         vn: "Khởi tạo GD không thành công do Website đang bị tạm khóa",
//         en: "Payment website is not available",
//     },
//     "05": {
//         vn: "Giao dịch không thành công do: Quý khách nhập sai mật khẩu thanh toán quá số lần quy định. Xin quý khách vui lòng thực hiện lại giao dịch",
//         en: "Transaction failed: Too many wrong password input",
//     },
//     "06": {
//         vn: "Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP). Xin quý khách vui lòng thực hiện lại giao dịch.",
//         en: "Transaction failed: Wrong OTP input",
//     },
//     "07": {
//         vn: "Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường). Đối với giao dịch này cần merchant xác nhận thông qua merchant admin: Từ chối/Đồng ý giao dịch",
//         en: "This transaction is suspicious",
//     },
//     "08": {
//         vn: "Giao dịch không thành công do: Hệ thống Ngân hàng đang bảo trì. Xin quý khách tạm thời không thực hiện giao dịch bằng thẻ/tài khoản của Ngân hàng này.",
//         en: "Transaction failed: The banking system is under maintenance. Please do not temporarily make transactions by card / account of this Bank.",
//     },
//     "09": {
//         vn: "Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.",
//         en: "Transaction failed: Cards / accounts of customer who has not yet registered for Internet Banking service.",
//     },
//     10: {
//         vn: "Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần",
//         en: "Transaction failed: Customer incorrectly validate the card / account information more than 3 times",
//     },
//     11: {
//         vn: "Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.",
//         en: "Transaction failed: Pending payment is expired. Please try again.",
//     },
//     24: {
//         vn: "Giao dịch không thành công do: Khách hàng hủy giao dịch",
//         en: "Transaction canceled",
//     },
//     51: {
//         vn: "Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.",
//         en: "Transaction failed: Your account is not enough balance to make the transaction.",
//     },
//     65: {
//         vn: "Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.",
//         en: "Transaction failed: Your account has exceeded the daily limit.",
//     },
//     75: {
//         vn: "Ngân hàng thanh toán đang bảo trì",
//         en: "Banking system is under maintenance",
//     },
//     default: {
//         vn: "Giao dịch thất bại",
//         en: "Failured",
//     },
// };
export class VNPayWebhookController extends BaseController {
    constructor() {
        super();

        this.path = "vnpay_webhook";
        this.customRouting();
    }

    customRouting() {
        this.router.get("", this.route(this.vnpayWebhook));
    }

    async vnpayWebhook(req: Request, res: Response) {
        let vnp_Params = req.query;
        delete vnp_Params["vnp_SecureHash"];
        delete vnp_Params["vnp_SecureHashType"];

        vnp_Params = vnpayService.sortObject(vnp_Params);

        let secretKey = config.vnpay.hashSecret;

        let querystring = require("qs");
        let signData = querystring.stringify(vnp_Params, { encode: false });
        let crypto = require("crypto");
        let hmac = crypto.createHmac("sha512", secretKey);
        hmac.update(new Buffer(signData, "utf-8")).digest("hex");
        const vnp_TxnRef = vnp_Params["vnp_TxnRef"];
        let buyCoinRequest = await buyCoinRequestRepository.findOne({
            where: {
                transactionCode: vnp_TxnRef,
            },
        });
        if (
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
                        status:
                            vnp_Params["vnp_ResponseCode"] == "07"
                                ? BuyCoinRequestStatus.APPROVED
                                : BuyCoinRequestStatus.REJECTED,
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