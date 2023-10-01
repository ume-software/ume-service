import { CreateServiceRequest } from "@/common/requests";
import prisma from "@/models/base.prisma";
import {
    serviceAttributeRepository,
    serviceAttributeValueRepository,
    serviceRepository,
} from "@/repositories";
import { errorService } from "@/services";
import {
    BasePrismaService,
    ICrudOptionPrisma,
} from "@/services/base/basePrisma.service";
import { ERROR_MESSAGE } from "@/services/errors/errorMessage";
import { Prisma, Service } from "@prisma/client";

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
        if (!result) {
            throw errorService.error(ERROR_MESSAGE.THIS_SKILL_DOES_NOT_EXISTED);
        }
        return result;
    }

    async create(serviceCreateInput: CreateServiceRequest) {
        const service = await prisma.$transaction(async (tx) => {
            const { serviceAttributes, ...serviceCreateData } =
                serviceCreateInput;
            const service = await this.repository.create(serviceCreateData, tx);
            for (const serviceAttributeData of serviceAttributes) {
                const {
                    serviceAttributeValues,
                    ...serviceAttributeCreateDate
                } = serviceAttributeData;
                const serviceAttribute =
                    await serviceAttributeRepository.create(
                        {
                            ...serviceAttributeCreateDate,
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
            return service;
        });

        return await this.repository.findOne({
            where: {
                id: service.id,
            },
            include: {
                serviceAttributes: {
                    include: {
                        serviceAttributeValue: true,
                    },
                },
            },
        });
    }

    async findOne(query?: ICrudOptionPrisma): Promise<Service> {
        const result = await this.repository.findOne(query);
        if (!result) {
            throw errorService.error(ERROR_MESSAGE.THIS_SKILL_DOES_NOT_EXISTED);
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
            throw errorService.error(ERROR_MESSAGE.THIS_SKILL_DOES_NOT_EXISTED);
        }
        return await this.repository.updateById(serviceId, serviceUpdateInput);
    }
    async deleteByServiceId(serviceId: string): Promise<Service> {
        const result = await this.repository.deleteById(serviceId);
        if (!result) {
            throw errorService.error(ERROR_MESSAGE.THIS_SKILL_DOES_NOT_EXISTED);
        }
        return result;
    }
}
