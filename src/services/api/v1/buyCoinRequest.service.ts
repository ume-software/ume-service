import { BuyCoinHandleRequest } from "@/common/requests/buyCoinHandle.request";
import { CreateBuyCoinRequest } from "@/common/requests/createBuyCoin.request";
import prisma from "@/models/base.prisma";
import { coinSettingRepository, buyCoinRequestRepository, coinHistoryRepository } from "@/repositories";
import { errorService, identitySystemService, utilService } from "@/services";
import { BasePrismaService } from "@/services/base/basePrisma.service";
import { ERROR_MESSAGE } from "@/services/errors/errorMessage";
import { BuyCoinRequestStatus, CoinType, Prisma, UnitCurrency } from "@prisma/client";

export class BuyCoinRequestService extends BasePrismaService<typeof buyCoinRequestRepository> {
    constructor() {
        super(buyCoinRequestRepository);
    }
    async createBuyCoin(requesterId: string, getQrBuyCoinRequest: CreateBuyCoinRequest) {
        const { amountCoin, platform, unitCurrency } = getQrBuyCoinRequest;
        if (!amountCoin || !platform || !unitCurrency) {
            throw errorService.router.badRequest();
        }
        return await prisma.$transaction(async (tx) => {
            let transactionCode = "";
            do {
                transactionCode = utilService.generateTransactionCode();
                if ((await this.repository.findOne({
                    where: {
                        transactionCode
                    }
                }))) {
                    transactionCode = "";
                }
            } while (!transactionCode);
            const { totalMoney } = await coinSettingRepository.convertCoinToMoneyForBuyCoin(amountCoin, unitCurrency, platform);
            const tranferContent = `${transactionCode}`;
            const { qrString, adminPaymentSystem } = await identitySystemService.getQr({
                amount: totalMoney,
                platform,
                tranferContent
            })

            return await this.repository.create({
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

    async buyCoinHandle(adminId: string, buyCoinHandleRequest: BuyCoinHandleRequest) {
        const { id, status, billImageUrl, feedback } = buyCoinHandleRequest;
        if (!id || !status) {
            throw errorService.router.badRequest();
        }

        let buyCoinRequest = await this.repository.findById(id);
        if (!buyCoinRequest) {
            throw errorService.database.queryFail(ERROR_MESSAGE.BUY_COIN_REQUEST_NOT_FOUND)
        }
        if (buyCoinRequest.handlerId != adminId) {
            throw errorService.auth.permissionDeny();
        }
        const { APPROVED, INIT, PENDING, REJECTED, USER_NOTICES_PAID } = BuyCoinRequestStatus
        if (![USER_NOTICES_PAID, INIT, PENDING].includes(buyCoinRequest.status as any) || [INIT, USER_NOTICES_PAID].includes(status as any)) {
            throw errorService.router.badRequest();
        }
        if ([APPROVED, REJECTED].includes(buyCoinRequest.status as any)) {
            throw errorService.router.badRequest(ERROR_MESSAGE.BUY_COIN_REQUEST_HAS_BEEN_PROCESSED);
        }

        return await prisma.$transaction(async (tx) => {
            const body: Prisma.BuyCoinRequestUpdateInput = {
                billImageUrl: billImageUrl!,
                handlerFeeback: feedback!,
                status,
            }

            if (status == APPROVED) {
                const coinHistory = await coinHistoryRepository.create({
                    user: {
                        connect: {
                            id: buyCoinRequest?.requesterId!
                        }
                    },
                    amount: buyCoinRequest?.amountCoin!,
                    coinType: CoinType.BUY_COIN,
                    createdId: adminId
                }, tx);
                body.coinHistory = {
                    connect: {
                        id: coinHistory.id
                    }
                }
            }
            buyCoinRequest = await this.repository.updateById(id, body, tx)
            return buyCoinRequest
        });

    }

}