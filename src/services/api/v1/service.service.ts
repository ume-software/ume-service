import {
    CreateServiceRequest,
    HandleServiceAttributeValueRequest,
    UpdateServiceRequest,
} from "@/common/requests";
import { EHandleType } from "@/enums/handleType.enum";
import prisma from "@/models/base.prisma";
import {
    providerServiceRepository,
    serviceAttributeRepository,
    serviceAttributeValueRepository,
    serviceRepository,
} from "@/repositories";
import { PrismaTransaction } from "@/repositories/base/basePrisma.repository";
import { errorService } from "@/services";
import {
    BasePrismaService,
    ICrudOptionPrisma,
} from "@/services/base/basePrisma.service";
import { ERROR_MESSAGE } from "@/services/errors/errorMessage";
import { Prisma, Service } from "@prisma/client";
import _ from "lodash";

export class ServiceService extends BasePrismaService<
    typeof serviceRepository
> {
    constructor() {
        super(serviceRepository);
    }
    async findAndCountAll(query?: ICrudOptionPrisma): Promise<{
        row: Service[];
        count: number;
    }> {
        const result = await this.repository.findAndCountAll(query);

        return result;
    }

    async providerGetServiceHaveNotRegistered(
        userId: string,
        query?: ICrudOptionPrisma
    ): Promise<{
        row: Service[];
        count: number;
    }> {
        const serviceIds = (
            await providerServiceRepository.findMany({
                where: {
                    providerId: userId,
                },
                select: {
                    id: true,
                },
            })
        ).map((item) => item.serviceId);
        if (!query) query = {};
        _.set(query, "where.NOT.0.id.in", serviceIds);
        const result = await this.repository.findAndCountAll(query);
        return result;
    }

    async providerGetServiceHaveRegistered(
        userId: string,
        query?: ICrudOptionPrisma
    ): Promise<{
        row: Service[];
        count: number;
    }> {
        const serviceIds = (
            await providerServiceRepository.findMany({
                where: {
                    providerId: userId,
                },
                select: {
                    id: true,
                },
            })
        ).map((item) => item.serviceId);
        if (!query) query = {};
        _.set(query, "where.id.in", serviceIds);
        const result = await this.repository.findAndCountAll(query);
        return result;
    }
    async create(serviceCreateInput: CreateServiceRequest) {
        return await prisma.$transaction(async (tx) => {
            const { serviceAttributes, ...serviceCreateData } =
                serviceCreateInput;
            const service = await this.repository.create(serviceCreateData, tx);
            for (const serviceAttributeData of serviceAttributes) {
                const {
                    serviceAttributeValues,
                    ...serviceAttributeCreateData
                } = serviceAttributeData;
                const serviceAttribute =
                    await serviceAttributeRepository.create(
                        {
                            ...serviceAttributeCreateData,
                            service: {
                                connect: {
                                    id: service.id,
                                },
                            },
                        },
                        tx
                    );

                for (const serviceAttributeValueData of serviceAttributeValues) {
                    await serviceAttributeValueRepository.create(
                        {
                            ...serviceAttributeValueData,
                            serviceAttribute: {
                                connect: {
                                    id: serviceAttribute.id,
                                },
                            },
                        },
                        tx
                    );
                }
            }

            return await this.repository.findOne(
                {
                    where: {
                        id: service.id,
                    },
                    include: {
                        serviceAttributes: {
                            include: {
                                serviceAttributeValues: true,
                            },
                        },
                    },
                },
                tx
            );
        });
    }

    async findOne(query?: ICrudOptionPrisma): Promise<Service> {
        const result = await this.repository.findOne(query);
        if (!result) {
            throw errorService.error(
                ERROR_MESSAGE.THIS_SERVICE_DOES_NOT_EXISTED
            );
        }
        return result;
    }

    async updateServiceById(
        serviceId: string,
        serviceUpdateInput: Prisma.ServiceUpdateInput
    ) {
        const service = await this.repository.findOne({
            where: { id: serviceId },
        });
        if (!service) {
            throw errorService.error(
                ERROR_MESSAGE.THIS_SERVICE_DOES_NOT_EXISTED
            );
        }
        return await this.repository.updateById(serviceId, serviceUpdateInput);
    }
    async adminUpdateServiceById(
        serviceId: string,
        serviceUpdateInput: UpdateServiceRequest
    ) {
        const service = await this.repository.findOne({
            where: { id: serviceId },
        });
        if (!service) {
            throw errorService.error(
                ERROR_MESSAGE.THIS_SERVICE_DOES_NOT_EXISTED
            );
        }
        return await prisma.$transaction(async (tx) => {
            const { serviceAttributes, ...serviceCreateData } =
                serviceUpdateInput;
            const service = await this.repository.create(serviceCreateData, tx);
            if (serviceAttributes) {
                for (const serviceAttributeData of serviceAttributes) {
                    const {
                        serviceAttributeValues,
                        ...serviceAttributeCreateData
                    } = serviceAttributeData;
                    const {
                        handleType,
                        id: serviceAttributeHandleId,
                        ...serviceAttributeHandleData
                    } = serviceAttributeCreateData;
                    switch (handleType) {
                        case EHandleType.CREATE: {
                            const newServiceAttribute =
                                await serviceAttributeRepository.create(
                                    {
                                        ...serviceAttributeHandleData,
                                        service: {
                                            connect: {
                                                id: service.id,
                                            },
                                        },
                                    },
                                    tx
                                );

                            await this.handleServiceAttributeValues(
                                newServiceAttribute.id,
                                serviceAttributeValues,
                                tx
                            );
                            break;
                        }
                        case EHandleType.UPDATE: {
                            await serviceAttributeRepository.updateById(
                                serviceAttributeHandleId!,
                                {
                                    ...serviceAttributeHandleData,
                                    service: {
                                        connect: {
                                            id: service.id,
                                        },
                                    },
                                },
                                tx
                            );
                            await this.handleServiceAttributeValues(
                                serviceAttributeHandleId!,
                                serviceAttributeValues,
                                tx
                            );
                            break;
                        }
                        case EHandleType.DELETE: {
                            await serviceAttributeRepository.deleteById(
                                serviceAttributeHandleId!,
                                tx
                            );
                            await serviceAttributeValueRepository.deleteMany({
                                serviceAttributeId: serviceAttributeHandleId!,
                            });
                            break;
                        }
                    }
                }
            }

            return await this.repository.findOne(
                {
                    where: {
                        id: service.id,
                    },
                    include: {
                        serviceAttributes: {
                            include: {
                                serviceAttributeValues: true,
                            },
                        },
                    },
                },
                tx
            );
        });
    }

    private async handleServiceAttributeValues(
        serviceAttributeId: string,
        serviceAttributeValues: Array<HandleServiceAttributeValueRequest>,
        tx: PrismaTransaction = prisma
    ) {
        for (const serviceAttributeValueData of serviceAttributeValues) {
            const { handleType, id, ...serviceAttributeValueHandleData } =
                serviceAttributeValueData;
            switch (handleType) {
                case EHandleType.CREATE: {
                    await serviceAttributeValueRepository.create(
                        {
                            ...serviceAttributeValueHandleData,
                            serviceAttribute: {
                                connect: {
                                    id: serviceAttributeId,
                                },
                            },
                        },
                        tx
                    );
                    break;
                }
                case EHandleType.UPDATE: {
                    await serviceAttributeValueRepository.updateById(
                        id!,
                        {
                            ...serviceAttributeValueHandleData,
                        },
                        tx
                    );
                    break;
                }
                case EHandleType.DELETE: {
                    await serviceAttributeValueRepository.deleteMany(
                        {
                            serviceAttributeId: id!,
                        },
                        tx
                    );
                    break;
                }
            }
        }
    }

    async deleteByServiceId(serviceId: string): Promise<Service> {
        const result = await this.repository.deleteById(serviceId);
        if (!result) {
            throw errorService.error(
                ERROR_MESSAGE.THIS_SERVICE_DOES_NOT_EXISTED
            );
        }
        return result;
    }

    async getServiceAttributeByServiceSlug(
        slug: string,
        query: ICrudOptionPrisma
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
        _.set(query, "where.serviceId", service.id);
        return await serviceAttributeRepository.findAndCountAll(query);
    }
}
