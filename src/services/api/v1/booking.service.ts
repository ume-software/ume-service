import { BookingHandleRequest } from "@/common/requests/booking/bookingHandle.request";
import { BookingProviderRequest } from "@/common/requests/booking/bookingProvider.request";
import { config } from "@/configs";
import { Request } from "@/controllers/base/base.controller";
import prisma from "@/models/base.prisma";
import {
    balanceHistoryRepository,
    balanceSettingRepository,
    noticeRepository,
    userRepository,
    bookingHistoryRepository,
    providerServiceRepository,
    voucherRepository,
    voucherRedeemedBookingRepository,
} from "@/repositories";

import { BookingHistoryRepository } from "@/repositories/common/bookingHistory.repository";
import { balanceService, errorService } from "@/services";
import {
    BasePrismaService,
    ICrudOptionPrisma,
} from "@/services/base/basePrisma.service";
import { ERROR_MESSAGE } from "@/services/errors/errorMessage";
import { socketService } from "@/services/socketIO";

import {
    BookingStatus,
    BalanceType,
    NoticeType,
    Prisma,
    VoucherType,
    DiscountUnit,
} from "@prisma/client";
import moment from "moment";

export class BookingService extends BasePrismaService<BookingHistoryRepository> {
    constructor() {
        super(bookingHistoryRepository);
    }
    async findAndCountAll(query?: ICrudOptionPrisma) {
        return await this.repository.findAndCountAll(query);
    }
    async findOne(query?: ICrudOptionPrisma) {
        return await this.repository.findOne(query);
    }
    async getPendingBookingForProvider(userId: string) {
        const bookingLists =
            await bookingHistoryRepository.findAllPendingBookingProvider(
                userId
            );
        return {
            row: bookingLists,
            count: bookingLists.length,
        };
    }
    async getPendingBookingForUser(userId: string) {
        const bookingLists =
            await bookingHistoryRepository.findAllPendingBookingUser(userId);
        return {
            row: bookingLists,
            count: bookingLists.length,
        };
    }
    async getCurrentBookingForUser(bookerId: string) {
        const bookingLists =
            await bookingHistoryRepository.findAllCurrentBookingByBookerId(
                bookerId
            );
        return {
            row: bookingLists,
            count: bookingLists.length,
        };
    }
    async getCurrentBookingForProvider(providerId: string) {
        const bookingLists =
            await bookingHistoryRepository.findAllCurrentBookingByProviderId(
                providerId
            );
        return {
            row: bookingLists,
            count: bookingLists.length,
        };
    }
    async userBookingProvider(req: Request) {
        const bookingProviderRequest = new BookingProviderRequest(req.body);
        const bookerId = req.tokenInfo?.id;
        if (!bookerId) {
            throw errorService.badToken();
        }
        let {
            providerReceivedBalance,
            bookingPeriod,
            totalCostSpendBooking,
            voucherRedeemedBooking: voucherRedeemedBookingData,
            providerService,
            provider,
        } = await this.estimateBookingProvider(
            bookerId,
            bookingProviderRequest,
            false
        );
        const currentBookingForUser = await this.getCurrentBookingForUser(
            bookerId
        );
        if (currentBookingForUser.count) {
            throw errorService.badRequest(
                ERROR_MESSAGE.USER_BUSY_WITH_OTHER_BOOKING
            );
        }

        const getCurrentBookingForProvider =
            await this.getCurrentBookingForProvider(providerService.id);
        if (getCurrentBookingForProvider.count) {
            throw errorService.badRequest(
                ERROR_MESSAGE.PROVIDER_BUSY_WITH_OTHER_BOOKING
            );
        }
        return await prisma.$transaction(async (tx) => {
            const bookingHistory = await bookingHistoryRepository.create(
                {
                    bookingPeriod,
                    status: BookingStatus.INIT,
                    totalCost: totalCostSpendBooking,
                    booker: {
                        connect: {
                            id: bookerId,
                        },
                    },
                    providerService: {
                        connect: {
                            id: providerService.id,
                        },
                    },
                    providerReceivedBalance,
                },
                tx
            );
            if (voucherRedeemedBookingData?.length) {
                voucherRedeemedBookingData = voucherRedeemedBookingData.map(
                    (item) => ({
                        ...item,
                        bookingHistoryId: bookingHistory.id,
                    })
                );
                await voucherRedeemedBookingRepository.createMany(
                    voucherRedeemedBookingData as Prisma.VoucherRedeemedBookingCreateManyInput[],
                    tx
                );
            }

            await noticeRepository.create(
                {
                    user: {
                        connect: {
                            id: provider.id,
                        },
                    },
                    type: NoticeType.HAVE_BOOKING,
                    data: JSON.parse(JSON.stringify(bookingHistory)),
                },
                tx
            );
            const socketIO = this.socketIO(req);
            const userIdOfProvider =
                bookingHistory.providerService?.provider?.id;
            if (socketIO.connections && userIdOfProvider) {
                const socket = socketIO.connections[userIdOfProvider];
                if (socket) {
                    socketService.emitUserBookingProvider(
                        socket,
                        bookingHistory
                    );
                }
            }
            return bookingHistory;
        });
    }
    async estimateBookingProvider(
        bookerId: string,
        bookingProviderRequest: BookingProviderRequest,
        onlyEstimate: boolean = true
    ) {
        const { providerServiceId, bookingPeriod, voucherIds } =
            bookingProviderRequest;
        const booker = await userRepository.findOne({
            where: {
                id: bookerId,
            },
        });
        if (!booker) {
            throw errorService.error(ERROR_MESSAGE.BOOKER_DOES_NOT_EXISTED);
        }
        const nowTimehhmm = moment()
            .utcOffset(config.server.timezone)
            .format("HH:mm");

        const providerService =
            await providerServiceRepository.findOneIncludeBookingCostInSpecialTime(
                { id: providerServiceId },
                nowTimehhmm
            );

        if (!providerService) {
            throw errorService.error(
                ERROR_MESSAGE.THIS_PROVIDER_SERVICE_DOES_NOT_EXISTED
            );
        }
        const provider = await userRepository.findOne({
            where: {
                id: providerService?.providerId,
            },
        });
        if (!provider) {
            throw errorService.error(
                ERROR_MESSAGE.THIS_PROVIDER_DOES_NOT_EXISTED
            );
        }

        if (provider.id == bookerId) {
            throw errorService.error(
                ERROR_MESSAGE.YOU_CAN_NOT_BOOKING_YOURSELF
            );
        }

        let costPerHour = providerService.defaultCost;
        if (providerService.bookingCosts.length) {
            costPerHour = providerService.bookingCosts[0]?.amount!;
        }
        const totalCost = bookingPeriod * costPerHour;
        const { totalBalanceAvailable } =
            await balanceService.getTotalBalanceByUserSlug(booker?.id!);

        const vouchers = await voucherRepository.findMany({
            where: {
                id: {
                    in: voucherIds,
                },
            },
        });
        const voucherByBookerId = (
            await voucherRepository.findVoucherByBookerId(
                booker.id,
                provider.id
            )
        ).map((item) => item.id);
        let voucherRedeemedBookingData: any[] = [];
        let totalCashbackValueByVoucherProvider = 0;
        let totalCashbackValueByVoucherSystem = 0;
        let totalDiscountValueByVoucherProvider = 0;
        let totalDiscountValueByVoucherSystem = 0;
        if (voucherIds?.length)
            for (const voucher of vouchers) {
                if (
                    (voucher.providerId && provider.id != voucher.providerId) ||
                    !voucherByBookerId.includes(voucher.id)
                ) {
                    throw errorService.error(
                        ERROR_MESSAGE.VOUCHER_CANNOT_APPLY_TO_BOOKING,
                        voucher
                    );
                }
                if (
                    (voucher.minimumBookingDurationForUsage &&
                        voucher.minimumBookingDurationForUsage >
                            bookingPeriod) ||
                    (voucher.minimumBookingTotalPriceForUsage &&
                        voucher.minimumBookingTotalPriceForUsage > totalCost)
                ) {
                    throw errorService.error(
                        ERROR_MESSAGE.YOU_ARE_NOT_ELIGIBLE_TO_USE_THE_VOUCHER,
                        voucher
                    );
                }

                let discountValue =
                    voucher.discountUnit == DiscountUnit.PERCENT
                        ? (voucher.discountValue / 100) * totalCost
                        : voucher.discountValue;

                if (
                    voucher.maximumDiscountValue &&
                    discountValue > voucher.maximumDiscountValue
                )
                    discountValue = voucher.maximumDiscountValue;

                switch (voucher.type) {
                    case VoucherType.CASHBACK: {
                        if (voucher.providerId) {
                            totalCashbackValueByVoucherProvider +=
                                discountValue;
                        } else {
                            totalCashbackValueByVoucherSystem += discountValue;
                        }
                        break;
                    }
                    case VoucherType.DISCOUNT: {
                        if (voucher.providerId) {
                            totalDiscountValueByVoucherProvider +=
                                discountValue;
                        } else {
                            totalDiscountValueByVoucherSystem += discountValue;
                        }
                        break;
                    }
                }
                voucherRedeemedBookingData.push({
                    bookerId: booker.id,
                    voucherId: voucher.id,
                    totalCashbackValue:
                        voucher.type == VoucherType.CASHBACK
                            ? discountValue
                            : 0,
                    totalDiscountValue:
                        voucher.type == VoucherType.DISCOUNT
                            ? discountValue
                            : 0,
                });
            }

        if (
            onlyEstimate &&
            totalBalanceAvailable <
                totalCost -
                    totalDiscountValueByVoucherProvider -
                    totalDiscountValueByVoucherSystem
        ) {
            throw errorService.error(
                ERROR_MESSAGE.YOU_DO_NOT_HAVE_ENOUGH_BALANCE_TO_MAKE_THE_TRANSACTION
            );
        }
        const checkHaveBookingWithCurrentProviderPending =
            await this.repository.findOne({
                where: {
                    providerService: {
                        provider: {
                            id: provider.id,
                        },
                    },
                    status: BookingStatus.INIT,
                    createdAt: {
                        gte: new Date(
                            new Date().valueOf() -
                                config.server.bookingExpireTimeMillisecond
                        ),
                    },
                },
            });
        if (checkHaveBookingWithCurrentProviderPending && onlyEstimate) {
            throw errorService.error(
                ERROR_MESSAGE.YOU_HAVE_A_TRANSACTION_PENDING_ACCEPT_FROM_THIS_PROVIDER
            );
        }

        const nearestBookingProviderAccepted = await this.repository.findOne({
            where: {
                providerService: {
                    provider: {
                        id: provider.id,
                    },
                },
                status: BookingStatus.PROVIDER_ACCEPT,
            },
            orderBy: {
                acceptedAt: "desc",
            },
        });

        if (nearestBookingProviderAccepted?.acceptedAt) {
            nearestBookingProviderAccepted.acceptedAt.setHours(
                nearestBookingProviderAccepted.acceptedAt.getHours() +
                    nearestBookingProviderAccepted.bookingPeriod
            );

            if (
                nearestBookingProviderAccepted.acceptedAt > new Date() &&
                onlyEstimate
            ) {
                throw errorService.error(
                    ERROR_MESSAGE.PROVIDER_BUSY_WITH_OTHER_BOOKING
                );
            }
        }
        const providerReceivedBalance =
            await balanceSettingRepository.calculateBalanceBookingForProvider(
                totalCost -
                    totalDiscountValueByVoucherProvider -
                    totalCashbackValueByVoucherProvider
            );

        return {
            providerService,
            provider,
            voucherRedeemedBooking: voucherRedeemedBookingData,
            costPerHour,
            bookingPeriod,
            totalCostBeforeVoucher: totalCost,
            totalCostNeedForBooking:
                totalCost -
                totalDiscountValueByVoucherProvider -
                totalDiscountValueByVoucherSystem,
            totalCostSpendBooking:
                totalCost -
                totalDiscountValueByVoucherProvider -
                totalDiscountValueByVoucherSystem -
                totalCashbackValueByVoucherProvider -
                totalCashbackValueByVoucherSystem,
            providerReceivedBalance,
            totalCashbackValueByVoucherProvider,
            totalCashbackValueByVoucherSystem,
            totalDiscountValueByVoucherProvider,
            totalDiscountValueByVoucherSystem,
        };
    }
    async bookingHandle(req: Request) {
        const bookingHandleRequest = new BookingHandleRequest(req.body);
        const userRequestId = req.tokenInfo?.id!;
        const { bookingHistoryId, status } = bookingHandleRequest;
        const {
            INIT,
            PROVIDER_ACCEPT,
            PROVIDER_CANCEL,
            USER_CANCEL,
            PROVIDER_FINISH_SOON,
            USER_FINISH_SOON,
        } = BookingStatus;

        const now = new Date();
        const fiveMinutesBefore = new Date(
            now.valueOf() - config.server.bookingExpireTimeMillisecond
        );
        const bookingHistoryForHandle = await bookingHistoryRepository.findOne({
            where: {
                id: bookingHistoryId,
            },
        });

        if (!bookingHistoryForHandle) {
            throw errorService.error(
                ERROR_MESSAGE.BOOKING_REQUEST_DOES_NOT_EXISTED
            );
        }

        const {
            bookerId,
            providerServiceId,
            totalCost,
            providerReceivedBalance,
        } = bookingHistoryForHandle;
        const providerService = await providerServiceRepository.findOne({
            where: {
                id: providerServiceId,
            },
        });
        if (!providerService) {
            throw errorService.error(
                ERROR_MESSAGE.THIS_PROVIDER_SERVICE_DOES_NOT_EXISTED
            );
        }
        const { providerId } = providerService;
        const provider = await userRepository.findOne({
            where: {
                id: providerId,
            },
        });
        if (!provider) {
            throw errorService.error(
                ERROR_MESSAGE.THIS_PROVIDER_DOES_NOT_EXISTED
            );
        }

        const requestFrom =
            userRequestId == bookerId
                ? "BOOKER"
                : userRequestId == provider.id
                ? "PROVIDER"
                : "OTHER";
        if (requestFrom == "OTHER") {
            throw errorService.permissionDeny();
        }
        const { status: oldStatus } = bookingHistoryForHandle;
        const hasBookingEnded =
            bookingHistoryForHandle.createdAt! < fiveMinutesBefore;
        return await prisma.$transaction(async (tx) => {
            if (!status.includes(requestFrom)) {
                throw errorService.permissionDeny();
            }
            const updateBookingHistoryRequest: Prisma.BookingHistoryUpdateInput =
                {
                    status,
                };
            if (status == PROVIDER_ACCEPT) {
                if (oldStatus != INIT) {
                    throw errorService.badRequest();
                }
                if (hasBookingEnded) {
                    throw errorService.error(ERROR_MESSAGE.BOOKING_ENDED);
                }
                await balanceHistoryRepository.create(
                    {
                        user: {
                            connect: {
                                id: bookerId!,
                            },
                        },
                        booking: {
                            connect: {
                                id: bookingHistoryId,
                            },
                        },
                        amount: -totalCost,
                        balanceType: BalanceType.SPEND_BOOKING,
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
                        booking: {
                            connect: {
                                id: bookingHistoryId,
                            },
                        },
                        amount: providerReceivedBalance,
                        balanceType: BalanceType.GET_BOOKING,
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
                throw errorService.badRequest();
            }
            if (
                (status == PROVIDER_CANCEL || status == USER_CANCEL) &&
                hasBookingEnded
            ) {
                throw errorService.error(ERROR_MESSAGE.BOOKING_ENDED);
            }

            const bookingHistory = await bookingHistoryRepository.updateById(
                bookingHistoryId,
                updateBookingHistoryRequest,
                tx
            );
            const socketIO = this.socketIO(req);
            if (socketIO.connections && bookingHistory.bookerId) {
                const socket = socketIO.connections[bookingHistory.bookerId];
                if (socket) {
                    socketService.emitProviderHandledBooking(
                        socket,
                        bookingHistory
                    );
                }
            }
            let type: NoticeType;
            switch (status) {
                case PROVIDER_CANCEL: {
                    type = NoticeType.BOOKING_HAS_BEEN_DECLINED;
                    await voucherRedeemedBookingRepository.deleteMany(
                        {
                            bookingHistoryId,
                        },
                        tx
                    );
                    break;
                }
                case PROVIDER_ACCEPT: {
                    type = NoticeType.BOOKING_HAS_BEEN_SUCCEEDED;
                    break;
                }
            }

            noticeRepository.create({
                user: {
                    connect: {
                        id: provider.id,
                    },
                },
                type: type!,
                data: JSON.parse(JSON.stringify(bookingHistory)),
            });
            return bookingHistory;
        });
    }

    async findAndCountAllProviderServiceByProviderSlug(
        providerSlug: string,
        query?: ICrudOptionPrisma
    ) {
        const provider = await userRepository.getByIdOrSlug(providerSlug);
        if (!provider) {
            throw errorService.error(
                ERROR_MESSAGE.THIS_PROVIDER_DOES_NOT_EXISTED
            );
        }
        if (!query) query = {};
        if (!query.where) query.where = {};
        if (!query.where.providerService) query.where.providerService = {};
        query.where.providerService.providerId = provider.id;

        return await this.repository.findAndCountAll(query);
    }

    async adminGetBookingStatisticsByProviderSlug(slug: string) {
        const provider = await userRepository.findOne({
            where: {
                OR: [
                    {
                        id: slug,
                    },
                    {
                        slug: slug,
                    },
                ],
            },
        });
        if (!provider) {
            throw errorService.error(
                ERROR_MESSAGE.THIS_PROVIDER_DOES_NOT_EXISTED
            );
        }

        const bookingHistoryAggregate = await prisma.bookingHistory.aggregate({
            _count: {
                bookerId: true,
            },
            _sum: {
                bookingPeriod: true,
                totalCost: true,
                providerReceivedBalance: true,
            },
            where: {
                providerService: {
                    providerId: provider.id,
                },
                status: {
                    in: [
                        BookingStatus.PROVIDER_ACCEPT,
                        BookingStatus.PROVIDER_FINISH_SOON,
                        BookingStatus.USER_FINISH_SOON,
                    ],
                },
            },
        });
        const totalFeedback = await prisma.feedback.count({
            where: {
                booking: {
                    providerService: {
                        providerId: provider.id,
                    },
                },
                deletedAt: null,
            },
        });
        const starAggregate = await prisma.feedback.aggregate({
            _avg: {
                amountStar: true,
            },
            where: {
                booking: {
                    providerService: {
                        providerId: provider.id,
                    },
                },
                amountStar: { not: null },
                deletedAt: null,
            },
        });
        return {
            star: starAggregate._avg.amountStar,
            totalFeedback,
            totalTime: bookingHistoryAggregate._sum.bookingPeriod,
            totalRevenue: bookingHistoryAggregate._sum.totalCost,
            totalProfit: bookingHistoryAggregate._sum.providerReceivedBalance,
            totalBookingSuccess: bookingHistoryAggregate._count.bookerId,
        };
    }
}
