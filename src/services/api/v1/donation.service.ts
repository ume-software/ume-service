import { DonationRequest } from "@/common/requests";
import {
    TopDonationDonorPagingResponse,
    TopDonationRecipientPagingResponse,
} from "@/common/responses";

import { ETopDonationDuration } from "@/enums/topDonationDuration.enum";
import prisma from "@/models/base.prisma";
import {
    balanceHistoryRepository,
    balanceSettingRepository,
    donationRepository,
    userRepository,
} from "@/repositories";
import { balanceService, errorService, utilService } from "@/services";
import { ERROR_MESSAGE } from "@/services/errors/errorMessage";
import { BalanceType } from "@prisma/client";

export class DonationService {
    async topDonationRecipient(
        duration: ETopDonationDuration,
        top: number
    ): Promise<TopDonationRecipientPagingResponse> {
        let result = await donationRepository.topDonationRecipient(
            duration,
            top
        );
        const recipientIds = result.map((item) => item.recipientId);

        const listRecipients = await userRepository.findMany({
            where: {
                id: {
                    in: recipientIds,
                },
            },
        });

        const mappingRecipients = utilService.convertArrayObjectToObject(
            listRecipients,
            "id"
        );
        const row = result.map((item) => {
            return {
                totalReceivedAmount: item._sum.receivedAmount || 0,
                numberDonationsReceived: item._count.receivedAmount,
                recipientId: item.recipientId,
                recipient: mappingRecipients[item.recipientId],
            };
        });
        return { row };
    }

    async topDonationDonor(
        duration: ETopDonationDuration,
        top: number
    ): Promise<TopDonationDonorPagingResponse> {
        let result = await donationRepository.topDonationDonor(duration, top);
        const donorIds = result.map((item) => item.donorId);

        const listDonors = await userRepository.findMany({
            where: {
                id: { in: donorIds },
            },
            select: {
                id: true,
                avatarUrl: true,
                dob: true,
                name: true,
                slug: true,
                gender: true,
            },
        });
        const mappingDonors = utilService.convertArrayObjectToObject(
            listDonors,
            "id"
        );
        const row = result.map((item) => {
            return {
                totalBalanceDonated: item._sum.donatedAmount || 0,
                numberDonated: item._count.donatedAmount,
                donorId: item.donorId,
                donor: mappingDonors[item.donorId],
            };
        });
        return { row };
    }

    async donationForRecipient(
        donorId: string,
        donateProviderRequest: DonationRequest
    ) {
        const { amount, message, recipientId } = donateProviderRequest;
        if (!donorId || !recipientId || !amount) {
            throw errorService.badRequest();
        }
        const { totalBalanceAvailable } =
            await balanceService.getTotalBalanceByUserSlug(donorId);

        if (totalBalanceAvailable < amount) {
            throw errorService.error(
                ERROR_MESSAGE.YOU_DO_NOT_HAVE_ENOUGH_BALANCE_TO_MAKE_THE_TRANSACTION
            );
        }
        const provider = await userRepository.findOne({
            where: {
                id: recipientId,
            },
        });
        if (!provider) {
            throw errorService.error(
                ERROR_MESSAGE.THIS_PROVIDER_DOES_NOT_EXISTED
            );
        }
        return await prisma.$transaction(async (tx) => {
            const actualReceivingAmount =
                await balanceSettingRepository.calculateBalanceDonateForProvider(
                    amount
                );
            const donation = await donationRepository.create(
                {
                    recipient: {
                        connect: {
                            id: recipientId,
                        },
                    },
                    donatedAmount: amount,
                    receivedAmount: actualReceivingAmount,
                    donor: {
                        connect: {
                            id: donorId,
                        },
                    },
                    message: message!,
                },
                tx
            );
            await balanceHistoryRepository.create(
                {
                    user: {
                        connect: {
                            id: donorId,
                        },
                    },
                    donation: {
                        connect: {
                            id: donation.id,
                        },
                    },
                    amount: -amount,
                    balanceType: BalanceType.SPEND_DONATE,
                },
                tx
            );

            await balanceHistoryRepository.create(
                {
                    user: {
                        connect: {
                            id: provider.id,
                        },
                    },
                    donation: {
                        connect: {
                            id: donation.id,
                        },
                    },
                    amount: actualReceivingAmount,
                    balanceType: BalanceType.GET_DONATE,
                },
                tx
            );

            return donation;
        });
    }
}
