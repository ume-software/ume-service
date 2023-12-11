import { CreateBookingComplaintRequest } from "@/common/requests/bookingComplaint/createBookingComplaint.request";
import {
    bookingComplaintRepository,
    bookingHistoryRepository,
} from "@/repositories";
import { errorService } from "@/services";
import {
    BasePrismaService,
    ICrudOptionPrisma,
} from "@/services/base/basePrisma.service";
import { ERROR_MESSAGE } from "@/services/errors/errorMessage";
import { BookingComplaintStatus, BookingStatus } from "@prisma/client";
import moment from "moment";

export class BookingComplaintService extends BasePrismaService<
    typeof bookingComplaintRepository
> {
    constructor() {
        super(bookingComplaintRepository);
    }
    async create(createBookingComplaintRequest: CreateBookingComplaintRequest) {
        const {
            bookerId,
            bookingId,
            attachments,
            complaintDescription,
            complaintType,
        } = createBookingComplaintRequest;
        const bookingHistory = await bookingHistoryRepository.findOne({
            where: {
                id: bookingId,
                bookerId: bookerId,
            },
        });
        if (!bookingHistory) {
            throw errorService.badRequest(
                ERROR_MESSAGE.BOOKING_DOES_NOT_EXISTED
            );
        }

        const bookingComplaintExisted = await this.repository.findOne({
            where: {
                bookingHistoryId: bookingId,
            },
        });
        if (bookingComplaintExisted) {
            throw errorService.error(
                ERROR_MESSAGE.YOU_HAVE_COMPLAINED_THIS_BOOKING_BEFORE
            );
        }
        if (
            [
                BookingStatus.INIT,
                BookingStatus.PROVIDER_CANCEL,
                BookingStatus.USER_CANCEL,
            ].includes(bookingHistory.status as any)
        ) {
            throw errorService.badRequest();
        }
        const nowDate = new Date();
        if (
            moment(bookingHistory.acceptedAt)
                .add(12 + bookingHistory.bookingPeriod, "hours")
                .toDate() > nowDate
        ) {
            throw errorService.badRequest(
                ERROR_MESSAGE.THE_TIME_FOR_COMPLAINT_THIS_BOOKING_HAS_EXPIRED
            );
        }
        return await this.repository.create({
            booking: {
                connect: { id: bookingId },
            },
            complaintDescription,
            complaintStatus: BookingComplaintStatus.PENDING_PROCESSING,
            complaintType,
            attachments: attachments as any,
        });
    }
    async findAndCountAll(query?: ICrudOptionPrisma) {
        return await this.repository.findAndCountAll(query);
    }
    async findOne(query?: ICrudOptionPrisma) {
        return await this.repository.findOne(query);
    }
}
