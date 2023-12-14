import { CreateBookingComplaintResponseRequest } from "@/common/requests";
import prisma from "@/models/base.prisma";
import {
    bookingComplaintRepository,
    bookingComplaintResponseRepository,
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
} from "@prisma/client";
import moment from "moment";

export class BookingComplaintResponseService extends BasePrismaService<
    typeof bookingComplaintResponseRepository
> {
    constructor() {
        super(bookingComplaintResponseRepository);
    }
    async providerCreateBookingComplaintResponse(
        createBookingComplaintResponseRequest: CreateBookingComplaintResponseRequest
    ) {
        const {
            requesterId,
            bookingComplaintId,
            responseMessage,
            attachments,
        } = createBookingComplaintResponseRequest;
        const bookingComplaint = await prisma.bookingComplaint.findFirst({
            where: {
                id: bookingComplaintId,
            },
            include: {
                booking: {
                    include: {
                        booker: {
                            select: {
                                id: true,
                                name: true,
                                slug: true,
                                avatarUrl: true,
                            },
                        },
                        providerService: {
                            include: {
                                provider: {
                                    select: {
                                        id: true,
                                        name: true,
                                        slug: true,
                                        avatarUrl: true,
                                    },
                                },
                                service: true,
                            },
                        },
                    },
                },
            },
        });
        if (!bookingComplaint) {
            throw errorService.recordNotFound();
        }
        if (
            bookingComplaint.booking.providerService?.providerId != requesterId
        ) {
            throw errorService.permissionDeny();
        }
        if (
            bookingComplaint.complaintStatus !=
            BookingComplaintStatus.AWAITING_PROVIDER_RESPONSE
        ) {
            throw errorService.badRequest();
        }
        if (
            moment(bookingComplaint.updatedAt).add(7, "days").toDate() <
            new Date()
        ) {
            throw errorService.badRequest(
                ERROR_MESSAGE.THE_DEADLINE_TO_RESPOND_TO_THE_COMPLAINT_IS_OVERDUE
            );
        }
        const result = await this.repository.create({
            bookingComplaint: {
                connect: {
                    id: bookingComplaintId,
                },
            },
            bookingComplaintResponseType:
                BookingComplaintResponseType.PROVIDER_SEND_TO_ADMIN,
            responseMessage: responseMessage,
            attachments: attachments as any,
        });
        await bookingComplaintRepository.updateById(bookingComplaint.id, {
            complaintStatus: BookingComplaintStatus.PROVIDER_RESPONDED,
        });
        return result;
    }
    async findAndCountAll(query?: ICrudOptionPrisma) {
        return await this.repository.findAndCountAll(query);
    }
    async findOne(query?: ICrudOptionPrisma) {
        return await this.repository.findOne(query);
    }
}
