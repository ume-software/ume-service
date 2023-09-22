import { ProviderSkillRequest } from "@/common/requests/providerSkill/providerSkill.request";
import { UpdateProviderSkillRequest } from "@/common/requests/providerSkill/updateProviderSkill.request";
import prisma from "@/models/base.prisma";
import {
    bookingCostRepository,
    providerSkillRepository,
    userRepository,
} from "@/repositories";
import { PrismaTransaction } from "@/repositories/base/basePrisma.repository";
import { errorService, skillService, utilService } from "@/services";
import {
    BasePrismaService,
    ICrudOptionPrisma,
} from "@/services/base/basePrisma.service";
import { ERROR_MESSAGE } from "@/services/errors/errorMessage";
import { BookingStatus, Prisma, ProviderSkill } from "@prisma/client";

export class ProviderSkillService extends BasePrismaService<
    typeof providerSkillRepository
> {
    constructor() {
        super(providerSkillRepository);
    }

    async create(userId: string, providerSkillRequest: ProviderSkillRequest) {
        const { skillId, defaultCost, description, createBookingCosts } =
            providerSkillRequest;
        if (this.checkOverlapTime(createBookingCosts)) {
            throw errorService.badRequest();
        }
        await skillService.findOne({ where: { id: skillId } });
        const provider = await userRepository.findOne({
            where: {
                userId,
            },
        });
        if (!provider) {
            throw errorService.error(
                ERROR_MESSAGE.THIS_PROVIDER_DOES_NOT_EXISTED
            );
        }

        // if (preExistingProviderSkill) {
        //   throw errorService.error(
        //     ERROR_MESSAGE.THIS_PROVIDER_SKILL_IS_EXISTED
        //   );
        // }
        const countSkillProvider = await this.repository.countByProviderId(
            provider.id
        );
        const position = countSkillProvider + 1;
        return await prisma.$transaction(async (tx: PrismaTransaction) => {
            let providerSkill = await this.repository.findOne({
                where: {
                    providerId: provider.id,
                    skillId,
                },
            });
            if (!providerSkill) {
                providerSkill = await this.repository.create(
                    {
                        skill: {
                            connect: {
                                id: skillId,
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
            const providerSkillId = providerSkill?.id!;
            const preExistingBookingCosts =
                await bookingCostRepository.findMany({
                    where: {
                        providerSkillId,
                    },
                });
            if (
                this.checkOverlapTime([
                    ...createBookingCosts,
                    ...preExistingBookingCosts,
                ])
            ) {
                throw errorService.badRequest();
            }

            const bookingCostCreateManyInput = createBookingCosts.map(
                (item) => ({
                    providerSkillId,
                    ...item,
                })
            );
            await bookingCostRepository.createMany(
                bookingCostCreateManyInput,
                false,
                tx
            );
            return await this.repository.findOne(
                {
                    where: {
                        id: providerSkill.id,
                    },
                    include: {
                        bookingCosts: true,
                    },
                },
                tx
            );
        });
    }
    async updateProviderSkill(
        userId: string,
        updateProviderSkillRequest: UpdateProviderSkillRequest
    ) {
        const {
            skillId,
            defaultCost,
            description,
            createBookingCosts,
            updateBookingCosts,
        } = updateProviderSkillRequest;
        if (
            this.checkOverlapTime([
                ...createBookingCosts,
                ...updateBookingCosts,
            ])
        ) {
            throw errorService.badRequest();
        }
        const skill = await skillService.findOne({ where: { id: skillId } });
        if (!skill) {
            throw errorService.error(ERROR_MESSAGE.THIS_SKILL_DOES_NOT_EXISTED);
        }
        const provider = await userRepository.findOne({
            where: {
                userId,
            },
        });
        if (!provider) {
            throw errorService.error(
                ERROR_MESSAGE.THIS_PROVIDER_DOES_NOT_EXISTED
            );
        }
        const preExistingProviderSkill = await this.repository.findOne({
            where: {
                skillId,
                providerId: provider.id,
            },
        });
        if (!preExistingProviderSkill) {
            return await this.create(userId, updateProviderSkillRequest);
        }
        const countSkillProvider = await this.repository.countByProviderId(
            provider.id
        );
        const position = countSkillProvider + 1;
        return await prisma.$transaction(async (tx: PrismaTransaction) => {
            let providerSkill = await this.repository.findOne({
                where: {
                    providerId: provider.id,
                    skillId,
                },
            });
            if (!providerSkill) {
                providerSkill = await this.repository.create(
                    {
                        skill: {
                            connect: {
                                id: skillId,
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
            const providerSkillId = providerSkill?.id!;
            const preExistingBookingCosts =
                await bookingCostRepository.findMany({
                    where: {
                        providerSkillId,
                    },
                });
            if (
                this.checkOverlapTime([
                    ...createBookingCosts,
                    ...preExistingBookingCosts,
                ])
            ) {
                throw errorService.badRequest();
            }

            const bookingCostCreateManyInput = createBookingCosts.map(
                (item) => ({
                    providerSkillId,
                    ...item,
                })
            );
            await bookingCostRepository.createMany(
                bookingCostCreateManyInput,
                false,
                tx
            );
            return await this.repository.findOne(
                {
                    where: {
                        id: providerSkill.id,
                    },
                    include: {
                        bookingCosts: true,
                    },
                },
                tx
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

    async findOne(query?: ICrudOptionPrisma): Promise<ProviderSkill | null> {
        return await this.repository.findOne(query);
    }

    async findAndCountAll(query?: ICrudOptionPrisma): Promise<{
        row: ProviderSkill[];
        count: number;
    }> {
        return await this.repository.findAndCountAll(query);
    }

    async findAndCountAllProviderSkillByProviderSlug(
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

        const listProviderSkillIds = result.row.map((item) => item.id);

        const listBookingHistoryAggregate = await Promise.all(
            listProviderSkillIds.map((providerSkillId: string) => {
                return prisma.bookingHistory.aggregate({
                    _sum: {
                        providerReceivedCoin: true,
                        bookingPeriod: true,
                        totalCost: true,
                    },
                    _count: {
                        id: true,
                    },
                    where: {
                        providerSkillId,
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
                _sum: { bookingPeriod, providerReceivedCoin, totalCost },
            } = bookingHistoryAggregate;
            return Object.assign(item, {
                totalReceivedCoin: providerReceivedCoin,
                totalBookingPeriod: bookingPeriod,
                totalRevenue: totalCost,
                totalBooking: id,
            });
        });
        return result;
    }
}
