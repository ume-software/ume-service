import { CreateDepositRequest } from "@/common/requests/createDeposit.request";
import prisma from "@/models/base.prisma";
import { coinSettingRepository, depositRequestRepository } from "@/repositories";
import { errorService, identitySystemService, utilService } from "@/services";
import { DepositRequestStatus, UnitCurrency } from "@prisma/client";

export class DepositRequestService {
    async createDepositRequest(requesterId: string, getQrDepositRequest: CreateDepositRequest) {
        const { amountCoin, platform, unitCurrency } = getQrDepositRequest;
        if (!amountCoin || !platform || !unitCurrency) {
            throw errorService.router.badRequest();
        }
        return await prisma.$transaction(async (tx) => {
            let transactionCode = "";
            do {
                transactionCode = utilService.generateTransactionCode();
                if ((await depositRequestRepository.findOne({
                    where: {
                        transactionCode
                    }
                }))) {
                    transactionCode = "";
                }
            } while (!transactionCode);
            const { totalMoney} = await coinSettingRepository.convertCoinToMoneyForDeposit(amountCoin, unitCurrency, platform);
            const tranferContent = `${transactionCode} - ${requesterId}`;
            const { qrString, adminPaymentSystem } = await identitySystemService.getQr({
                amount: totalMoney,
                platform,
                tranferContent
            })

            return await depositRequestRepository.create({
                requester: {
                    connect: {
                        id: requesterId
                    }
                },
                unitCurrency: UnitCurrency.VND,
                amountMoney: totalMoney,
                amountCoin,
                qrString,
                transactionCode,
                platform,
                handlerId: adminPaymentSystem.adminId,
                status: DepositRequestStatus.INIT,
                content: tranferContent
            }, tx);
        })


    }


}