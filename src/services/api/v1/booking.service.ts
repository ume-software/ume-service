import { BookingHandleRequest } from "@/common/requests/booking/bookingHandle.request";
import { BookingProviderRequest } from "@/common/requests/booking/bookingProvider.request";
import { config } from "@/configs";
import { Request } from "@/controllers/base/base.controller";
import prisma from "@/models/base.prisma";
import {
    coinHistoryRepository,
    coinSettingRepository,
    providerRepository,
} from "@/repositories";
import {
    bookingHistoryRepository,
    providerSkillRepository,
} from "@/repositories";
import { BookingHistoryRepository } from "@/repositories/common/bookingHistory.repository";
import {
    coinService,
    errorService,
    noticeService,
    providerService,
    userService,
} from "@/services";
import {
    BasePrismaService,
    ICrudOptionPrisma,
} from "@/services/base/basePrisma.service";
import { ERROR_MESSAGE } from "@/services/errors/errorMessage";
import { socketService } from "@/services/socketIO";

import { BookingStatus, CoinType, NoticeType, Prisma } from "@prisma/client";
import moment from "moment";

export class BookingService extends BasePrismaService<BookingHistoryRepository> {
    constructor() {
        super(bookingHistoryRepository);
    }
    async getCurrentBookingForProvider(userId: string) {
        const bookingLists =
            await bookingHistoryRepository.findAllCurrentBookingProvider(
                userId
            );
        return {
            row: bookingLists,
            count: bookingLists.length,
        };
    }
    async getCurrentBookingForUser(userId: string) {
        const bookingLists =
            await bookingHistoryRepository.findAllCurrentBookingUser(userId);
        return {
            row: bookingLists,
            count: bookingLists.length,
        };
    }
    async userBookingProvider(req: Request) {
        const bookingProviderRequest = new BookingProviderRequest(req.body);
        const bookerId = req.tokenInfo?.id;

        const { providerSkillId, bookingPeriod } = bookingProviderRequest;
        const booker = await userService.findOne({
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

        const providerSkill =
            await providerSkillRepository.findOneIncludeBookingCostInSpecialTime(
                { id: providerSkillId },
                nowTimehhmm
            );

        if (!providerSkill) {
            throw errorService.error(
                ERROR_MESSAGE.THIS_PROVIDER_SKILL_DOES_NOT_EXISTED
            );
        }
        const provider = await providerService.findOne({
            where: {
                id: providerSkill?.providerId,
            },
        });
        if (!provider) {
            throw errorService.error(
                ERROR_MESSAGE.THIS_PROVIDER_DOES_NOT_EXISTED
            );
        }
        if (provider.userId == bookerId) {
            throw errorService.error(
                ERROR_MESSAGE.YOU_CAN_NOT_BOOKING_YOURSELF
            );
        }

        let costPerHour = providerSkill.defaultCost;
        if (providerSkill.bookingCosts.length) {
            costPerHour = providerSkill.bookingCosts[0]?.amount!;
        }
        const totalCost = bookingPeriod * costPerHour;
        const { totalCoinsAvailable } =
            await coinService.getTotalCoinByUserSlug(booker?.id!);

        if (totalCoinsAvailable < totalCost) {
            throw errorService.error(
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
        const socketIO = this.socketIO(req);
        const userIdOfProvider = bookingHistory.providerSkill?.provider?.userId;
        if (socketIO.connections && userIdOfProvider) {
            const socket = socketIO.connections[userIdOfProvider];
            if (socket) {
                socketService.emitUserBookingProvider(socket, bookingHistory);
            }
        }
        noticeService.create({
            user: {
                connect: {
                    id: provider.userId,
                },
            },
            type: NoticeType.HAVE_BOOKING,
            data: JSON.parse(JSON.stringify(bookingHistory)),
        });
        return bookingHistory;
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
        const fiveMinutes = 5 * 60 * 1000;
        const now = new Date();
        const fiveMinutesBefore = new Date(now.valueOf() - fiveMinutes);
        const bookingHistory = await bookingHistoryRepository.findOne({
            where: {
                id: bookingHistoryId,
            },
        });

        if (!bookingHistory) {
            throw errorService.error(
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
            throw errorService.error(
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
            throw errorService.error(
                ERROR_MESSAGE.THIS_PROVIDER_DOES_NOT_EXISTED
            );
        }

        const requestFrom =
            userRequestId == bookerId
                ? "BOOKER"
                : userRequestId == provider.userId
                ? "PROVIDER"
                : "OTHER";
        if (requestFrom == "OTHER") {
            throw errorService.permissionDeny();
        }
        const { status: oldStatus } = bookingHistory;
        const hasBookingEnded = bookingHistory.createdAt! < fiveMinutesBefore;
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
                await coinHistoryRepository.create(
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
                        booking: {
                            connect: {
                                id: bookingHistoryId,
                            },
                        },
                        amount: await coinSettingRepository.calculateCoinBookingForProvider(
                            totalCost
                        ),
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
                    break;
                }
                case PROVIDER_ACCEPT: {
                    type = NoticeType.BOOKING_HAS_BEEN_SUCCESSED;
                    break;
                }
            }
            noticeService.create({
                user: {
                    connect: {
                        id: provider.userId,
                    },
                },
                type: type!,
                data: JSON.parse(JSON.stringify(bookingHistory)),
            });
            return bookingHistory;
        });
    }

    async findAndCountAllProviderSkillByProviderSlug(
        providerSlug: string,
        query?: ICrudOptionPrisma
    ) {
        const provider = await providerRepository.getByIdOrSlug(providerSlug);
        if (!provider) {
            throw errorService.error(
                ERROR_MESSAGE.THIS_PROVIDER_DOES_NOT_EXISTED
            );
        }
        if (!query) query = {};
        if (!query.where) query.where = {};
        query.where.providerId = provider.id;
        const result = await this.repository.findAndCountAll(query);

        return result;
    }
}
