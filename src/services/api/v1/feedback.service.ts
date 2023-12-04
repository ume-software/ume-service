import { FeedbackBookingRequest } from "@/common/requests/feedback/feedbackBooking.request";
import { UserInformationResponse } from "@/common/responses/user/userInformation.response";
import { bookingHistoryRepository, feedbackRepository } from "@/repositories";
import { errorService } from "@/services";
import {
    BasePrismaService,
    ICrudOptionPrisma,
} from "@/services/base/basePrisma.service";
import { ERROR_MESSAGE } from "@/services/errors/errorMessage";
import { BookingHistory, Feedback } from "@prisma/client";

type FeedbackByProviderServiceType = Feedback & {
    booking?: BookingHistory & {
        booker?: UserInformationResponse;
    };
};
export class FeedbackService extends BasePrismaService<
    typeof feedbackRepository
> {
    constructor() {
        super(feedbackRepository);
    }

    async getFeedbackByProviderService(query: ICrudOptionPrisma): Promise<{
        row: FeedbackByProviderServiceType[];
        count: number;
    }> {
        query.include = {
            ...query.include,
            booking: {
                include: {
                    booker: {
                        select: {
                            id: true,
                            avatarUrl: true,
                            dob: true,
                            name: true,
                            slug: true,
                            gender: true,
                        },
                    },
                },
            },
        };
        return await this.repository.findAndCountAll(query);
    }

    async create(feedbackBookingRequest: FeedbackBookingRequest) {
        const { amountStar, bookingId, content, bookerId } =
            feedbackBookingRequest;
        const checkBookingExisted = await bookingHistoryRepository.findOne({
            where: {
                id: bookingId,
                bookerId,
            },
        });
        if (!checkBookingExisted) {
            throw errorService.error(ERROR_MESSAGE.BOOKING_DOES_NOT_EXISTED);
        }
        const checkFeedbackExisted = await feedbackRepository.findOne({
            where: {
                bookingId,
            },
        });
        if (checkFeedbackExisted) {
            throw errorService.error(
                ERROR_MESSAGE.THIS_BOOKING_HAS_BEEN_FEEDBACK
            );
        }
        return await feedbackRepository.create({
            amountStar,
            content,
            booking: {
                connect: {
                    id: bookingId,
                },
            },
        });
    }
}
