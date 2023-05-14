import { BookingProviderRequest } from "@/common/requests/bookingProvider.request";
import { config } from "@/configs";
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
import { BookingStatus } from "@prisma/client";
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
}
