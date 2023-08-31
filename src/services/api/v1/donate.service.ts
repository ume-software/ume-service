import { DonateProviderRequest } from "@/common/requests";
import {
    TopDonateProviderPagingResponse,
    TopUserDonatePagingResponse,
} from "@/common/responses";
import { ETopDonateDuration } from "@/enums/topDonateDuration.enum";
import prisma from "@/models/base.prisma";
import {
    coinHistoryRepository,
    coinSettingRepository,
    donateProviderRepository,
    providerRepository,
} from "@/repositories";
import {
    coinService,
    errorService,
    identitySystemService,
    utilService,
} from "@/services";
import { ERROR_MESSAGE } from "@/services/errors/errorMessage";
import { CoinType } from "@prisma/client";

export class DonateService {
    async topDonateProvider(
        duration: ETopDonateDuration,
        top: number
    ): Promise<TopDonateProviderPagingResponse> {
        let result = await donateProviderRepository.topDonateProvider(
            duration,
            top
        );
        const providerIds = result.map((item) => item.providerId);

        const listProviders = await providerRepository.findMany({
            where: {
                id: {
                    in: providerIds,
                },
            },
        });

        const mappingProvider = utilService.convertArrayObjectToObject(
            listProviders,
            "id"
        );
        const row = result.map((item) => {
            return {
                actualReceivingAmount: item._sum.actualReceivingAmount || 0,
                countActualReceivingAmount: item._count.actualReceivingAmount,
                providerId: item.providerId,
                provider: mappingProvider[item.providerId],
            };
        });
        return { row };
    }

    async topUserDonate(
        duration: ETopDonateDuration,
        top: number
    ): Promise<TopUserDonatePagingResponse> {
        let result = await donateProviderRepository.topUserDonate(
            duration,
            top
        );
        const userIds = result.map((item) => item.userId);

        const listUsers = (
            await identitySystemService.getListByUserIds(userIds)
        ).row;
        const mappinguser = utilService.convertArrayObjectToObject(
            listUsers,
            "id"
        );
        const row = result.map((item) => {
            return {
                totalCoinDonate: item._sum.donateAmount || 0,
                countDonate: item._count.donateAmount,
                userId: item.userId,
                user: mappinguser[item.userId],
            };
        });
        return { row };
    }

    async donateForProvider(
        creatorId: string,
        donateProviderRequest: DonateProviderRequest
    ) {
        const { amount, message, providerId } = donateProviderRequest;
        if (!creatorId || !providerId || !amount) {
            throw errorService.router.badRequest();
        }
        const { totalCoinsAvailable } = await coinService.getTotalCoinByUserId(
            creatorId
        );

        if (totalCoinsAvailable < amount) {
            throw errorService.router.errorCustom(
                ERROR_MESSAGE.YOU_DO_NOT_HAVE_ENOUGH_COINS_TO_MAKE_THE_TRANSACTION
            );
        }
        const provider = await providerRepository.findOne({
            where: {
                id: providerId,
            },
        });
        if (!provider) {
            throw errorService.database.queryFail(
                ERROR_MESSAGE.THIS_PROVIDER_DOES_NOT_EXISTED
            );
        }
        return await prisma.$transaction(async (tx) => {
            await coinHistoryRepository.create(
                {
                    user: {
                        connect: {
                            id: creatorId,
                        },
                    },
                    createdId: creatorId,
                    amount: -amount,
                    coinType: CoinType.SPEND_DONATE,
                },
                tx
            );
            const actualReceivingAmount =
                await coinSettingRepository.calculateCoinDonateForProvider(
                    amount
                );
            await coinHistoryRepository.create(
                {
                    user: {
                        connect: {
                            id: provider.userId,
                        },
                    },
                    createdId: creatorId,
                    amount: actualReceivingAmount,
                    coinType: CoinType.GET_DONATE,
                },
                tx
            );
            return await donateProviderRepository.create(
                {
                    provider: {
                        connect: {
                            id: providerId,
                        },
                    },
                    donateAmount: amount,
                    actualReceivingAmount,
                    user: {
                        connect: {
                            id: creatorId,
                        },
                    },
                    message: message!,
                },
                tx
            );
        });
    }
}
