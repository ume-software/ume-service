import { CreateBuyCoinRequest } from "@/common/requests/createBuyCoin.request";
import prisma from "@/models/base.prisma";
import { coinSettingRepository, buyCoinRequestRepository } from "@/repositories";
import { errorService, identitySystemService, utilService } from "@/services";
import { BuyCoinRequestStatus, UnitCurrency } from "@prisma/client";

export class BuyCoinRequestService {
    async createBuyCoinRequest(requesterId: string, getQrBuyCoinRequest: CreateBuyCoinRequest) {
        const { amountCoin, platform, unitCurrency } = getQrBuyCoinRequest;
        if (!amountCoin || !platform || !unitCurrency) {
            throw errorService.router.badRequest();
        }
        return await prisma.$transaction(async (tx) => {
            let transactionCode = "";
            do {
                transactionCode = utilService.generateTransactionCode();
                if ((await buyCoinRequestRepository.findOne({
                    where: {
                        transactionCode
                    }
                }))) {
                    transactionCode = "";
                }
            } while (!transactionCode);
            const { totalMoney} = await coinSettingRepository.convertCoinToMoneyForBuyCoin(amountCoin, unitCurrency, platform);
            const tranferContent = `${transactionCode} - ${requesterId}`;
            const { qrString, adminPaymentSystem } = await identitySystemService.getQr({
                amount: totalMoney,
                platform,
                tranferContent
            })

            return await buyCoinRequestRepository.create({
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
                status: BuyCoinRequestStatus.INIT,
                content: tranferContent
            }, tx);
        })


    }


}