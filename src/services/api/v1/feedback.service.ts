
import { FeedbackBookingRequest } from "@/common/requests/feedbackBooking.request";
import { UserInformationResponse } from "@/common/responses/userInformation.response";
import { bookingHistoryRepository, feedbackRepository } from "@/repositories";
import { errorService, identitySystemService, utilService } from "@/services";
import {
    BasePrismaService, ICrudOptionPrisma,
} from "@/services/base/basePrisma.service";
import { ERROR_MESSAGE } from "@/services/errors/errorMessage";
import { BookingHistory, Feedback } from "@prisma/client";

type FeedbackByProviderSkillType = (
    Feedback &
    {
        booking?: (
            BookingHistory & {
                booker?: UserInformationResponse
            }
        );
    }
)
export class FeedbackService extends BasePrismaService<typeof feedbackRepository> {
    constructor() {
        super(feedbackRepository);
    }

    async getFeedbackByProviderSkill(query: ICrudOptionPrisma): Promise<{
        row: FeedbackByProviderSkillType[];
        count: number;
    }> {
        query.include = {
            ...query.include,
            booking: true
        }

        const result = await this.repository.findAndCountAll(query);
        const bookerIds: string[] = result.row.map(item => item.booking?.bookerId) as string[];
        const requestListIds = await identitySystemService.getListByUserIds(bookerIds)
        const listUserInfo: Array<UserInformationResponse> = requestListIds.row as Array<UserInformationResponse>;
        const usersInfo: { [key: string]: UserInformationResponse } = utilService.convertArrayObjectToObject(listUserInfo);

        result.row.forEach(item => {
            if (item.booking?.bookerId) {
                (item.booking as any).booker = usersInfo[item.booking.bookerId];
            }

        })

        return result;
    }

    async create(feedbackBookingRequest: FeedbackBookingRequest) {
        const { amountStar, bookingId, content, bookerId } = feedbackBookingRequest;
        const checkBookingExisted = await bookingHistoryRepository.findOne({
            where: {
                id: bookingId,
                bookerId
            }
        });
        if (!checkBookingExisted) {
            throw errorService.database.recordNotFound(ERROR_MESSAGE.BOOKING_DOES_NOT_EXISTED)
        }
        const checkFeedbackExisted = await feedbackRepository.findOne({
            where: {
                bookingId
            }
        })
        if (checkFeedbackExisted) {
            throw errorService.router.badRequest(ERROR_MESSAGE.THIS_BOOKING_HAS_BEEN_FEEDBACK)
        }
        return await feedbackRepository.create({
            amountStar,
            content,
            booking: {
                connect: {
                    id: bookerId
                }
            }
        })
    }
}