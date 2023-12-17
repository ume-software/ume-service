import { AdminHandleBookingComplaintRequest } from "@/common/requests";
import { CreateBookingComplaintRequest } from "@/common/requests/bookingComplaint/createBookingComplaint.request";
import prisma from "@/models/base.prisma";
import {
    balanceHistoryRepository,
    bookingComplaintRepository,
    bookingComplaintResponseRepository,
    bookingHistoryRepository,
    providerServiceRepository,
    userRepository,
} from "@/repositories";
import { PrismaTransaction } from "@/repositories/base/basePrisma.repository";
import { errorService, nodemailerService } from "@/services";
import {
    BasePrismaService,
    ICrudOptionPrisma,
} from "@/services/base/basePrisma.service";
import { ERROR_MESSAGE } from "@/services/errors/errorMessage";
import {
    BalanceType,
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
        return await prisma.$transaction(async (tx: PrismaTransaction) => {
            await bookingHistoryRepository.updateById(
                bookingHistory.id,
                {
                    isProcessingComplaint: true,
                },
                tx
            );
            return await this.repository.create({
                booking: {
                    connect: { id: bookingId },
                },
                complaintDescription,
                complaintStatus: BookingComplaintStatus.PENDING_PROCESSING,
                complaintType,
                attachments: attachments as any,
            });
        });
    }

    async adminHandleBookingComplaintHistory(
        adminHandleBookingComplaintRequest: AdminHandleBookingComplaintRequest
    ) {
        const { bookingComplaintStatus, bookingComplaintResponseRequests, id } =
            adminHandleBookingComplaintRequest;
        const bookingComplaint = await this.repository.findById(id);
        if (!bookingComplaint) {
            throw errorService.recordNotFound();
        }
        const bookingHistory = await bookingHistoryRepository.findOne({
            where: {
                id: bookingComplaint.bookingHistoryId,
            },
        });
        if (!bookingHistory) {
            throw errorService.recordNotFound();
        }
        const booker = await userRepository.findOne({
            where: {
                id: bookingHistory.bookerId!,
            },
        });
        const providerService = await providerServiceRepository.findOne({
            where: {
                id: bookingHistory.providerServiceId,
            },
        });
        const provider = await userRepository.findOne({
            where: {
                id: providerService?.providerId!,
            },
        });
        const bookingComplaintStatusAvailable =
            this.getBookingComplaintStatusAvailable(
                bookingComplaint.complaintStatus
            );

        if (!bookingComplaintStatusAvailable.includes(bookingComplaintStatus)) {
            throw errorService.badRequest();
        }
        let bookingComplaintResponseTypeAvailable: BookingComplaintResponseType[] =
            [];
        switch (bookingComplaintStatus) {
            case BookingComplaintStatus.AWAITING_PROVIDER_RESPONSE: {
                bookingComplaintResponseTypeAvailable = [
                    BookingComplaintResponseType.ADMIN_SEND_TO_PROVIDER,
                ];
                break;
            }
            case BookingComplaintStatus.REJECTED: {
                bookingComplaintResponseTypeAvailable = [
                    BookingComplaintResponseType.ADMIN_SEND_TO_PROVIDER,
                    BookingComplaintResponseType.ADMIN_SEND_TO_BOOKER,
                ];
                break;
            }
            case BookingComplaintStatus.RESOLVED: {
                bookingComplaintResponseTypeAvailable = [
                    BookingComplaintResponseType.ADMIN_SEND_TO_PROVIDER,
                    BookingComplaintResponseType.ADMIN_SEND_TO_BOOKER,
                ];
                break;
            }
        }
        return await prisma.$transaction(async (tx: PrismaTransaction) => {
            const sendEmails: Array<{
                to: string;
                preview: string;
                description: string;
                subject?: string | undefined;
            }> = [];
            if (bookingComplaintResponseRequests) {
                for (const bookingComplaintResponseRequest of bookingComplaintResponseRequests) {
                    if (
                        !bookingComplaintResponseTypeAvailable.includes(
                            bookingComplaintResponseRequest.bookingComplaintResponseType
                        )
                    )
                        continue;
                    await bookingComplaintResponseRepository.create(
                        {
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
                        },
                        tx
                    );
                    switch (
                        bookingComplaintResponseRequest.bookingComplaintResponseType
                    ) {
                        case BookingComplaintResponseType.ADMIN_SEND_TO_BOOKER: {
                            if (!booker) break;
                            let content = "";
                            switch (bookingComplaintStatus) {
                                case BookingComplaintStatus.REJECTED: {
                                    content = "Kiếu nại của bạn đã bị từ chối";
                                    break;
                                }
                                case BookingComplaintStatus.RESOLVED: {
                                    content =
                                        "Kiếu nại của bạn đã được giải quyết";
                                    break;
                                }
                            }
                            if (booker.isAllowNotificationToEmail)
                                sendEmails.push({
                                    to: booker.email!,
                                    description: nodemailerService.contentMail(
                                        booker.name!,
                                        `<p style="color: white;">${content}
                                    .</p >${
                                        "content"
                                            ? `<p style="color: white;">Lời nhắn : ${bookingComplaintResponseRequest.responseMessage}</p>`
                                            : ""
                                    }`
                                    ),
                                    preview: `UME - ${content}`,
                                    subject:
                                        "UME - Có một thông báo từ quản trị viên về khiếu nại của bạn",
                                });
                            break;
                        }
                        case BookingComplaintResponseType.ADMIN_SEND_TO_PROVIDER: {
                            if (!provider) break;
                            let content = "";
                            switch (bookingComplaintStatus) {
                                case BookingComplaintStatus.REJECTED: {
                                    content =
                                        "Phản hồi khiếu nại của bạn đã được quản trị viên chấp thuận";
                                    break;
                                }
                                case BookingComplaintStatus.RESOLVED: {
                                    content =
                                        "Phản hồi khiếu nại của bạn đã bị từ chối";
                                    break;
                                }
                            }
                            if (provider.isAllowNotificationToEmail)
                                sendEmails.push({
                                    to: provider.email!,
                                    description: nodemailerService.contentMail(
                                        provider.name!,
                                        `<p style="color: white;">${content}
                                    .</p >${
                                        "content"
                                            ? `<p style="color: white;">Lời nhắn :  ${bookingComplaintResponseRequest.responseMessage}</p>`
                                            : ""
                                    }`
                                    ),
                                    preview: `UME - ${content}`,
                                    subject:
                                        "UME - Có một thông báo từ quản trị viên về việc bạn bị ánh",
                                });
                            break;
                        }
                    }
                }
            }

            const result = await this.repository.updateById(
                bookingComplaint.id,
                {
                    complaintStatus: bookingComplaintStatus,
                    sendedToProviderAt:
                        bookingComplaintStatus ==
                        BookingComplaintStatus.AWAITING_PROVIDER_RESPONSE
                            ? new Date()
                            : bookingComplaint.sendedToProviderAt,
                },
                tx
            );

            if (
                (
                    [
                        BookingComplaintStatus.RESOLVED,
                        BookingComplaintStatus.REJECTED,
                    ] as Array<BookingComplaintStatus>
                ).includes(bookingComplaintStatus)
            ) {
                await bookingHistoryRepository.updateById(
                    bookingHistory.id,
                    {
                        isProcessingComplaint: false,
                        isRefund:
                            bookingComplaintStatus ==
                            BookingComplaintStatus.RESOLVED,
                    },
                    tx
                );
            }
            if (bookingComplaintStatus == BookingComplaintStatus.RESOLVED) {
                const balanceHistories =
                    await balanceHistoryRepository.findMany(
                        {
                            where: {
                                bookingId: bookingHistory.id,
                                balanceType: {
                                    in: [
                                        BalanceType.GET_BOOKING,
                                        BalanceType.SPEND_BOOKING,
                                    ],
                                },
                            },
                        },
                        tx
                    );
                for (const balanceHistory of balanceHistories) {
                    balanceHistoryRepository.create({
                        user: {
                            connect: {
                                id: balanceHistory.userId,
                            },
                        },
                        booking: {
                            connect: {
                                id: bookingHistory.id,
                            },
                        },
                        amount: -(balanceHistory.amount || 0),
                        balanceType:
                            balanceHistory.balanceType ==
                            BalanceType.GET_BOOKING
                                ? BalanceType.PROVIDER_REFUND
                                : BalanceType.REFUND_TO_USER,
                    });
                }
            }
            for (const sendEmail of sendEmails) {
                nodemailerService.sendEmail(sendEmail);
            }
            return result;
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
                return [
                    BookingComplaintStatus.AWAITING_PROVIDER_RESPONSE,
                    BookingComplaintStatus.REJECTED,
                ];
            }
            case BookingComplaintStatus.AWAITING_PROVIDER_RESPONSE: {
                return [
                    BookingComplaintStatus.PROVIDER_RESPONDED,
                    BookingComplaintStatus.RESOLVED,
                ];
            }
            case BookingComplaintStatus.PROVIDER_RESPONDED: {
                return [
                    BookingComplaintStatus.REJECTED,
                    BookingComplaintStatus.RESOLVED,
                ];
            }
        }
        return [];
    }
}
