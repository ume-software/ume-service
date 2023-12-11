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
import { BookingComplaintStatus } from "@prisma/client";

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
