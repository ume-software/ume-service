import { AdminHandleBookingComplaintRequest } from "@/common/requests";
import { CreateBookingComplaintRequest } from "@/common/requests/bookingComplaint/createBookingComplaint.request";
import {
    bookingComplaintRepository,
    bookingComplaintResponseRepository,
    bookingHistoryRepository,
} from "@/repositories";
import { errorService } from "@/services";
import {
    BasePrismaService,
    ICrudOptionPrisma,
} from "@/services/base/basePrisma.service";
import { ERROR_MESSAGE } from "@/services/errors/errorMessage";
import {
    BookingComplaintResponseType,
    BookingComplaintStatus,
    BookingStatus,
} from "@prisma/client";
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
                .toDate() < nowDate
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

    async adminHandleBookingComplaintHistory(
        adminHandleBookingComplaintRequest: AdminHandleBookingComplaintRequest
    ) {
        const { bookingComplaintStatus, bookingComplaintResponseRequest, id } =
            adminHandleBookingComplaintRequest;
        const bookingComplaint = await this.repository.findById(id);
        if (!bookingComplaint) {
            throw errorService.recordNotFound();
        }
        if (
            this.getBookingComplaintStatusAvailable(
                bookingComplaint.complaintStatus
            ).includes(bookingComplaintStatus)
        ) {
            throw errorService.badRequest();
        }
        if (bookingComplaintResponseRequest) {
            switch (bookingComplaintStatus) {
                case BookingComplaintStatus.RESOLVED:
                case BookingComplaintStatus.REJECTED:
                case BookingComplaintStatus.UNRESOLVABLE:
                case BookingComplaintStatus.PROCESSING: {
                    bookingComplaintResponseRequest.bookingComplaintResponseType =
                        BookingComplaintResponseType.ADMIN_SEND_TO_BOOKER;
                    break;
                }
                case BookingComplaintStatus.REJECTED_RESPONSE_FROM_PROVIDER:
                case BookingComplaintStatus.AWAITING_PROVIDER_RESPONSE: {
                    bookingComplaintResponseRequest.bookingComplaintResponseType =
                        BookingComplaintResponseType.ADMIN_SEND_TO_PROVIDER;
                    break;
                }
            }
            if (bookingComplaintResponseRequest.bookingComplaintResponseType) {
                bookingComplaintResponseRepository.create({
                    bookingComplaint: {
                        connect: {
                            id: bookingComplaint.id,
                        },
                    },
                    bookingComplaintResponseType:
                        bookingComplaintResponseRequest.bookingComplaintResponseType,
                    responseMessage:
                        bookingComplaintResponseRequest.responseMessage,
                    attachments:
                        bookingComplaintResponseRequest.attachments as any,
                });
            }
        }
        return await this.repository.updateById(bookingComplaint.id, {
            complaintStatus: bookingComplaintStatus,
        });
    }
    async findAndCountAll(query?: ICrudOptionPrisma) {
        return await this.repository.findAndCountAll(query);
    }
    async findOne(query?: ICrudOptionPrisma) {
        return await this.repository.findOne(query);
    }
    private getBookingComplaintStatusAvailable(
        oldBookingComplaintStatus: BookingComplaintStatus
    ): Array<BookingComplaintStatus> {
        switch (oldBookingComplaintStatus) {
            case BookingComplaintStatus.PENDING_PROCESSING: {
                return [BookingComplaintStatus.PROCESSING];
            }
            case BookingComplaintStatus.PROCESSING: {
                return [
                    BookingComplaintStatus.AWAITING_PROVIDER_RESPONSE,
                    BookingComplaintStatus.REJECTED,
                ];
            }
            case BookingComplaintStatus.AWAITING_PROVIDER_RESPONSE: {
                return [
                    BookingComplaintStatus.PROCESSING_RESPONSE_FROM_PROVIDER,
                    BookingComplaintStatus.RESOLVED,
                ];
            }
            case BookingComplaintStatus.PROCESSING_RESPONSE_FROM_PROVIDER: {
                return [
                    BookingComplaintStatus.REJECTED_RESPONSE_FROM_PROVIDER,
                    BookingComplaintStatus.UNRESOLVABLE,
                ];
            }
            case BookingComplaintStatus.REJECTED_RESPONSE_FROM_PROVIDER: {
                return [BookingComplaintStatus.RESOLVED];
            }
        }
        return [];
    }
}
