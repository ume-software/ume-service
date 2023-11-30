import { ProviderServiceRequest } from "@/common/requests/providerService/providerService.request";
import { UpdateProviderServiceRequest } from "@/common/requests/providerService/updateProviderService.request";
import prisma from "@/models/base.prisma";
import {
    bookingCostRepository,
    providerServiceAttributeRepository,
    providerServiceAttributeValueRepository,
    providerServiceRepository,
    serviceRepository,
    userRepository,
} from "@/repositories";
import { PrismaTransaction } from "@/repositories/base/basePrisma.repository";
import { errorService, serviceService, utilService } from "@/services";
import {
    BasePrismaService,
    ICrudOptionPrisma,
} from "@/services/base/basePrisma.service";
import { ERROR_MESSAGE } from "@/services/errors/errorMessage";
import { BookingStatus, Prisma, ProviderService } from "@prisma/client";

export class ProviderServiceService extends BasePrismaService<
    typeof providerServiceRepository
> {
    constructor() {
        super(providerServiceRepository);
    }

    async create(
        userId: string,
        providerServiceRequest: ProviderServiceRequest
    ) {
        const {
            serviceId,
            defaultCost,
            description,
            createBookingCosts,
            createServiceAttributes,
        } = providerServiceRequest;

        if (createBookingCosts && this.checkOverlapTime(createBookingCosts)) {
            throw errorService.badRequest();
        }
        const service = await serviceService.findOne({
            where: { id: serviceId },
        });
        if (!service) {
            throw errorService.error(
                ERROR_MESSAGE.THIS_SERVICE_DOES_NOT_EXISTED
            );
        }
        const provider = await userRepository.findOne({
            where: {
                id: userId,
            },
        });
        if (!provider) {
            throw errorService.error(
                ERROR_MESSAGE.THIS_PROVIDER_DOES_NOT_EXISTED
            );
        }

        const countServiceProvider = await this.repository.countByProviderId(
            provider.id
        );
        const position = countServiceProvider + 1;
        return await prisma.$transaction(async (tx: PrismaTransaction) => {
            let providerService = await this.repository.findOne({
                where: {
                    providerId: provider.id,
                    serviceId,
                },
            });
            if (!providerService) {
                providerService = await this.repository.create(
                    {
                        service: {
                            connect: {
                                id: serviceId,
                            },
                        },
                        provider: {
                            connect: {
                                id: provider.id,
                            },
                        },
                        defaultCost,
                        position,
                        description,
                    },
                    tx
                );
            }
            const providerServiceId = providerService?.id!;
            const preExistingBookingCosts =
                await bookingCostRepository.findMany({
                    where: {
                        providerServiceId,
                    },
                });
            if (
                createBookingCosts &&
                this.checkOverlapTime([
                    ...createBookingCosts,
                    ...preExistingBookingCosts,
                ])
            ) {
                throw errorService.badRequest();
            }

            const bookingCostCreateManyInput = (createBookingCosts ?? []).map(
                (item) => ({
                    providerServiceId,
                    ...item,
                })
            );
            await bookingCostRepository.createMany(
                bookingCostCreateManyInput,
                false,
                tx
            );
            // Create Provider service Attribute
            if (createServiceAttributes?.length) {
                for (const serviceAttribute of createServiceAttributes) {
                    const providerServiceAttribute =
                        await providerServiceAttributeRepository.create(
                            {
                                providerService: {
                                    connect: {
                                        id: providerService.id,
                                    },
                                },
                                serviceAttribute: {
                                    connect: {
                                        id: serviceAttribute.id,
                                    },
                                },
                            },
                            tx
                        );
                    for (const serviceAttributeValueId of serviceAttribute.serviceAttributeValueIds ??
                        []) {
                        providerServiceAttributeValueRepository.create(
                            {
                                providerServiceAttribute: {
                                    connect: {
                                        id: providerServiceAttribute.id,
                                    },
                                },
                                serviceAttributeValue: {
                                    connect: {
                                        id: serviceAttributeValueId,
                                    },
                                },
                            },
                            tx
                        );
                    }
                }
            }
            return await this.repository.findOne(
                {
                    where: {
                        id: providerService.id,
                    },
                    include: {
                        bookingCosts: true,
                    },
                },
                tx
            );
        });
    }
    async updateProviderService(
        userId: string,
        updateProviderServiceRequest: UpdateProviderServiceRequest
    ) {
        const {
            serviceId,
            defaultCost,
            description,
            position,
            handleBookingCosts,
            handleProviderServiceAttributes,
        } = updateProviderServiceRequest;
        if (this.checkOverlapTime([...handleBookingCosts])) {
            throw errorService.error(
                ERROR_MESSAGE.SPECIAL_TIME_PERIODS_CANNOT_OVERLAP
            );
        }
        const service = await serviceService.findOne({
            where: { id: serviceId },
        });
        if (!service) {
            throw errorService.error(
                ERROR_MESSAGE.THIS_SERVICE_DOES_NOT_EXISTED
            );
        }
        const provider = await userRepository.findOne({
            where: {
                id: userId,
            },
        });
        if (!provider) {
            throw errorService.error(
                ERROR_MESSAGE.THIS_PROVIDER_DOES_NOT_EXISTED
            );
        }
        let preExistingProviderService = await this.repository.findOne({
            where: {
                serviceId,
                providerId: provider.id,
            },
        });

        if (!preExistingProviderService) {
            return await this.create(userId, updateProviderServiceRequest);
        }

        return await prisma.$transaction(async (tx: PrismaTransaction) => {
            if (!preExistingProviderService) {
                const countServiceProvider =
                    await this.repository.countByProviderId(provider.id, tx);
                const position = countServiceProvider + 1;
                preExistingProviderService = await this.repository.create(
                    {
                        service: {
                            connect: {
                                id: serviceId,
                            },
                        },
                        provider: {
                            connect: {
                                id: provider.id,
                            },
                        },
                        defaultCost,
                        position,
                        description,
                    },
                    tx
                );
            }

            const preExistingBookingCosts =
                await bookingCostRepository.findMany({
                    where: {
                        providerServiceId: preExistingProviderService.id,
                    },
                });
            const handleBookingCostIds = handleBookingCosts
                .filter((item) => item.id)
                .map((item) => item.id);
            const removeBookingCosts = preExistingBookingCosts.filter(
                (item) => !handleBookingCostIds.includes(item.id)
            );
            for (const handleBookingCost of handleBookingCosts) {
                const { id: handleBookingCostId, ...handleBookingCostData } =
                    handleBookingCost;
                if (handleBookingCostId) {
                    await bookingCostRepository.updateById(
                        handleBookingCostId,
                        handleBookingCostData,
                        tx
                    );
                } else {
                    await bookingCostRepository.create(
                        {
                            ...handleBookingCostData,
                            providerService: {
                                connect: {
                                    id: preExistingProviderService.id,
                                },
                            },
                        },
                        tx
                    );
                }
            }
            if (removeBookingCosts.length) {
                await bookingCostRepository.deleteMany(
                    {
                        providerServiceId: preExistingProviderService.id,
                        id: {
                            in: removeBookingCosts.map((item) => item.id),
                        },
                    },
                    tx
                );
            }
            //-------------
            const oldServiceAttributeIds = (
                await tx.providerServiceAttribute.findMany({
                    where: {
                        providerServiceId: preExistingProviderService.id,
                    },
                    select: {
                        serviceAttributeId: true,
                    },
                })
            ).map((item) => item.serviceAttributeId);
            const handleServiceAttributeIds =
                handleProviderServiceAttributes.map((item) => item.id);
            const removeServiceAttributeIds = oldServiceAttributeIds.filter(
                (item) => !handleServiceAttributeIds.includes(item)
            );
            for (const handleProviderServiceAttribute of handleProviderServiceAttributes) {
                const {
                    id: serviceAttributeId,
                    handleServiceAttributeValueIds,
                } = handleProviderServiceAttribute;

                let providerServiceAttribute =
                    await tx.providerServiceAttribute.findFirst({
                        where: {
                            serviceAttributeId,
                            providerServiceId: preExistingProviderService.id,
                        },
                    });
                if (!providerServiceAttribute) {
                    providerServiceAttribute =
                        await tx.providerServiceAttribute.create({
                            data: {
                                providerServiceId:
                                    preExistingProviderService.id,
                                serviceAttributeId,
                            },
                        });
                }

                const oldServiceAttributeValueIds = (
                    await tx.providerServiceAttributeValue.findMany({
                        where: {
                            providerServiceAttributeId:
                                providerServiceAttribute.id,
                        },
                        select: {
                            serviceAttributeValueId: true,
                        },
                    })
                ).map((item) => item.serviceAttributeValueId);
                const removeServiceAttributeValueIds =
                    oldServiceAttributeValueIds.filter(
                        (item) => !handleServiceAttributeValueIds.includes(item)
                    );

                // Find items in new but not in old
                const createServiceAttributeValueIds =
                    handleServiceAttributeValueIds.filter(
                        (item) => !oldServiceAttributeValueIds.includes(item)
                    );

                await tx.providerServiceAttributeValue.deleteMany({
                    where: {
                        serviceAttributeValueId: {
                            in: removeServiceAttributeValueIds,
                        },
                        providerServiceAttributeId: providerServiceAttribute.id,
                    },
                });
                await tx.providerServiceAttributeValue.createMany({
                    data: createServiceAttributeValueIds.map(
                        (serviceAttributeValueId: string) => ({
                            providerServiceAttributeId:
                                providerServiceAttribute?.id!,
                            serviceAttributeValueId,
                        })
                    ),
                });
            }
            for (const removeServiceAttributeId of removeServiceAttributeIds) {
                const providerServiceAttributesWillRemove =
                    await tx.providerServiceAttribute.findMany({
                        where: {
                            serviceAttributeId: removeServiceAttributeId,
                            providerServiceId: preExistingProviderService.id,
                        },
                    });
                const providerServiceAttributeIdsWillRemove =
                    providerServiceAttributesWillRemove.map((item) => item.id);
                await tx.providerServiceAttribute.deleteMany({
                    where: {
                        id: {
                            in: providerServiceAttributeIdsWillRemove,
                        },
                    },
                });
                await tx.providerServiceAttributeValue.deleteMany({
                    where: {
                        providerServiceAttributeId: {
                            in: providerServiceAttributeIdsWillRemove,
                        },
                    },
                });
            }

            await tx.providerService.update({
                where: {
                    id: preExistingProviderService.id,
                },
                data: {
                    defaultCost,
                    description,
                },
            });
            if (position) {
                const swapProviderService = await tx.providerService.findFirst({
                    where: {
                        position,
                        providerId: preExistingProviderService.providerId,
                    },
                });
                await tx.providerService.update({
                    where: {
                        id: preExistingProviderService.id,
                    },
                    data: {
                        position,
                    },
                });
                if (swapProviderService) {
                    await tx.providerService.update({
                        where: {
                            id: swapProviderService.id,
                        },
                        data: {
                            position: preExistingProviderService.position,
                        },
                    });
                }
            }

            return await tx.providerService.findFirst(
                {
                    where: {
                        id: preExistingProviderService.id,
                    },
                    include: {
                        bookingCosts: true,
                        service: true,
                        providerServiceAttributes: {
                            include: {
                                serviceAttribute: true,
                                providerServiceAttributeValues: {
                                    include: {
                                        serviceAttributeValue: true,
                                    },
                                    where: {
                                        deletedAt: null,
                                    },
                                },
                            },
                            where: {
                                deletedAt: null,
                            },
                        },
                    },
                }
                // tx
            );
        });
    }

    checkOverlapTime(data: Prisma.BookingCostUpdateInput[]) {
        for (let i = 0; i < data.length - 1; i++) {
            const valueStartTime = utilService.timeToMinutes(
                data[i]?.startTimeOfDay?.toString()!
            );
            const valueEndTime = utilService.timeToMinutes(
                data[i]?.endTimeOfDay?.toString()!
            );
            if (valueStartTime >= valueEndTime) return false;
            for (let j = i + 1; j < data.length; j++) {
                const itemStartTime = utilService.timeToMinutes(
                    data[j]?.startTimeOfDay?.toString()!
                );
                const itemEndTime = utilService.timeToMinutes(
                    data[j]?.endTimeOfDay?.toString()!
                );
                if (
                    utilService.checkOverlap(
                        valueStartTime,
                        valueEndTime,
                        itemStartTime,
                        itemEndTime
                    )
                ) {
                    return true;
                }
            }
        }
        return false;
    }

    async findOne(query?: ICrudOptionPrisma): Promise<ProviderService | null> {
        return await this.repository.findOne(query);
    }

    async findAndCountAll(query?: ICrudOptionPrisma): Promise<{
        row: ProviderService[];
        count: number;
    }> {
        return await this.repository.findAndCountAll(query);
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
        query.where.providerId = provider.id;
        const result = await this.repository.findAndCountAll(query);

        const listProviderServiceIds = result.row.map((item) => item.id);

        const listBookingHistoryAggregate = await Promise.all(
            listProviderServiceIds.map((providerServiceId: string) => {
                return prisma.bookingHistory.aggregate({
                    _sum: {
                        providerReceivedBalance: true,
                        bookingPeriod: true,
                        totalCost: true,
                    },
                    _count: {
                        id: true,
                    },
                    where: {
                        providerServiceId,
                        status: {
                            in: [
                                BookingStatus.PROVIDER_ACCEPT,
                                BookingStatus.PROVIDER_FINISH_SOON,
                                BookingStatus.USER_FINISH_SOON,
                            ],
                        },
                    },
                });
            })
        );
        result.row = result.row.map((item, index) => {
            const bookingHistoryAggregate = listBookingHistoryAggregate[index];
            if (!bookingHistoryAggregate) return item;
            const {
                _count: { id },
                _sum: { bookingPeriod, providerReceivedBalance, totalCost },
            } = bookingHistoryAggregate;
            return Object.assign(item, {
                totalReceivedBalance: providerReceivedBalance,
                totalBookingPeriod: bookingPeriod,
                totalRevenue: totalCost,
                totalBooking: id,
            });
        });
        return result;
    }

    async providerDeleteProviderServiceBySlugService(
        providerId: string,
        slug: string
    ) {
        const service = await serviceRepository.findOne({
            where: {
                OR: [{ slug }, { id: slug }],
            },
        });
        if (!service) {
            throw errorService.error(
                ERROR_MESSAGE.THIS_SERVICE_DOES_NOT_EXISTED
            );
        }
        const providerServiceExisted = await this.repository.findOne({
            where: {
                providerId: providerId,
                serviceId: service.id,
            },
        });
        if (!providerServiceExisted) {
            throw errorService.error(
                ERROR_MESSAGE.THIS_PROVIDER_SERVICE_DOES_NOT_EXISTED
            );
        }

        return await prisma.$transaction(async (tx: PrismaTransaction) => {
            const providerServiceAttributes =
                await tx.providerServiceAttribute.findMany({
                    where: {
                        providerServiceId: providerServiceExisted.id,
                    },
                });
            const providerServiceAttributeIds = providerServiceAttributes.map(
                (item) => item.id
            );
            await tx.providerServiceAttributeValue.deleteMany({
                where: {
                    providerServiceAttributeId: {
                        in: providerServiceAttributeIds,
                    },
                },
            });
            await tx.providerServiceAttribute.deleteMany({
                where: {
                    id: {
                        in: providerServiceAttributeIds,
                    },
                },
            });

            const providerService = await tx.providerService.delete({
                where: {
                    id: providerServiceExisted.id,
                },
            });
            await tx.providerService.updateMany({
                data: {
                    position: {
                        decrement: 1,
                    },
                },
                where: {
                    position: {
                        gte: providerService.position,
                    },
                    providerId,
                },
            });
            return providerService;
        });
    }
}
