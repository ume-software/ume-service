import { BookingHandleRequest } from "@/common/requests/bookingHandle.request";
import { BookingProviderRequest } from "@/common/requests/bookingProvider.request";
import { config } from "@/configs";
import prisma from "@/models/base.prisma";
import { coinHistoryRepository, providerRepository } from "@/repositories";
import {
    bookingHistoryRepository,
    providerSkillRepository,
} from "@/repositories";
import {
    coinService,
    errorService,
    providerService,
    userService,
} from "@/services";
import { ERROR_MESSAGE } from "@/services/errors/errorMessage";
import { BookingStatus, CoinType, Prisma } from "@prisma/client";
import moment from "moment";

export class BookingService {
    async userBookingProvider(
        bookerId: string,
        bookingProviderRequest: BookingProviderRequest
    ) {
        const { providerSkillId, bookingPeriod } = bookingProviderRequest;
        const booker = await userService.findOne({
            where: {
                id: bookerId,
            },
        });
        if (!booker) {
            throw errorService.database.errorCustom(
                ERROR_MESSAGE.BOOKER_DOES_NOT_EXISTED
            );
        }
        const nowTimehhmm = moment()
            .utcOffset(config.server.timezone)
            .format("HH:mm");

        const providerSkill =
            await providerSkillRepository.findOneIncludeBookingCostInSpecialTime(
                { id: providerSkillId },
                nowTimehhmm
            );

        if (!providerSkill) {
            throw errorService.database.errorCustom(
                ERROR_MESSAGE.THIS_PROVIDER_SKILL_DOES_NOT_EXISTED
            );
        }
        const provider = await providerService.findOne({
            where: {
                id: providerSkill?.providerId,
            },
        });
        if (!provider) {
            throw errorService.database.errorCustom(
                ERROR_MESSAGE.THIS_PROVIDER_DOES_NOT_EXISTED
            );
        }
        if (provider.userId == bookerId) {
            throw errorService.router.errorCustom(
                ERROR_MESSAGE.YOU_CAN_NOT_BOOKING_YOURSELF
            );
        }

        let costPerHour = providerSkill.defaultCost;
        if (providerSkill.bookingCosts.length) {
            costPerHour = providerSkill.bookingCosts[0]?.amount!;
        }
        const totalCost = bookingPeriod * costPerHour;
        const { totalCoinsAvailable } = await coinService.getTotalCoinByUserId(
            booker?.id!
        );

        if (totalCoinsAvailable < totalCost) {
            throw errorService.router.errorCustom(
                ERROR_MESSAGE.YOU_DO_NOT_HAVE_ENOUGH_COINS_TO_MAKE_THE_TRANSACTION
            );
        }
        const bookingHistory = await bookingHistoryRepository.create({
            bookingPeriod,
            status: BookingStatus.INIT,
            totalCost,
            booker: {
                connect: {
                    id: booker.id,
                },
            },
            providerSkill: {
                connect: {
                    id: providerSkill.id,
                },
            },
        });
        return bookingHistory;
    }

    async bookingHandle(
        userRquestId: string,
        bookingHandleRequest: BookingHandleRequest
    ) {
        const { bookingHistoryId, status } = bookingHandleRequest;
        const {
            INIT,
            PROVIDER_ACCEPT,
            PROVIDER_CANCEL,
            USER_CANCEL,
            PROVIDER_FINISH_SOON,
            USER_FINISH_SOON,
        } = BookingStatus;
        const fiveMinutes = 5 * 60 * 1000;
        const now = new Date();
        const fiveMinutesBefore = new Date(now.valueOf() - fiveMinutes);
        const bookingHistory = await bookingHistoryRepository.findOne({
            where: {
                id: bookingHistoryId,
            },
        });

        if (!bookingHistory) {
            throw errorService.database.errorCustom(
                ERROR_MESSAGE.BOOKING_REQUEST_DOES_NOT_EXISTED
            );
        }
        const { bookerId, providerSkillId, totalCost } = bookingHistory;
        const providerSkill = await providerSkillRepository.findOne({
            where: {
                id: providerSkillId,
            },
        });
        if (!providerSkill) {
            throw errorService.database.errorCustom(
                ERROR_MESSAGE.THIS_PROVIDER_SKILL_DOES_NOT_EXISTED
            );
        }
        const { providerId } = providerSkill;
        const provider = await providerRepository.findOne({
            where: {
                id: providerId,
            },
        });
        if (!provider) {
            throw errorService.database.errorCustom(
                ERROR_MESSAGE.THIS_PROVIDER_DOES_NOT_EXISTED
            );
        }

        const requestFrom =
            userRquestId == bookerId
                ? "BOOKER"
                : userRquestId == provider.userId
                ? "PROVIDER"
                : "OTHER";
        if (requestFrom == "OTHER") {
            throw errorService.auth.permissionDeny();
        }
        const { status: oldStatus } = bookingHistory;
        const hasBookingEnded = bookingHistory.createdAt! < fiveMinutesBefore;
        return await prisma.$transaction(async (tx) => {
            if (!status.includes(requestFrom)) {
                throw errorService.auth.permissionDeny();
            }
            const updateBookingHistoryRequest: Prisma.BookingHistoryUpdateInput =
                {
                    status,
                };
            if (status == PROVIDER_ACCEPT) {
                if (oldStatus != INIT) {
                    throw errorService.router.badRequest();
                }
                if (hasBookingEnded) {
                    throw errorService.router.errorCustom(
                        ERROR_MESSAGE.BOOKING_ENDED
                    );
                }
                await coinHistoryRepository.create(
                    {
                        user: {
                            connect: {
                                id: bookerId!,
                            },
                        },
                        createdId: userRquestId,
                        amount: -totalCost,
                        coinType: CoinType.SPEND_BOOKING,
                    },
                    tx
                );
                await coinHistoryRepository.create(
                    {
                        user: {
                            connect: {
                                id: provider.userId,
                            },
                        },
                        createdId: userRquestId,
                        amount: totalCost,
                        coinType: CoinType.GET_BOOKING,
                    },
                    tx
                );
                updateBookingHistoryRequest.acceptedAt = new Date();
            }
            if (
                (oldStatus != INIT &&
                    (status == PROVIDER_CANCEL || status == USER_CANCEL)) ||
                (oldStatus != PROVIDER_ACCEPT &&
                    oldStatus != PROVIDER_CANCEL &&
                    USER_CANCEL &&
                    (status == USER_FINISH_SOON ||
                        status == PROVIDER_FINISH_SOON))
            ) {
                throw errorService.router.badRequest();
            }
            if (
                (status == PROVIDER_CANCEL || status == USER_CANCEL) &&
                hasBookingEnded
            ) {
                throw errorService.router.errorCustom(
                    ERROR_MESSAGE.BOOKING_ENDED
                );
            }

            return await bookingHistoryRepository.updateById(
                bookingHistoryId,
                updateBookingHistoryRequest,
                tx
            );
        });
    }
}
