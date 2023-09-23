import { serviceRepository } from "@/repositories";
import { errorService } from "@/services";
import {
    BasePrismaService,
    ICrudOptionPrisma,
} from "@/services/base/basePrisma.service";
import { ERROR_MESSAGE } from "@/services/errors/errorMessage";
import { Prisma, Service } from "@prisma/client";

export class ServiceService extends BasePrismaService<typeof serviceRepository> {
    constructor() {
        super(serviceRepository);
    }
    async findAndCountAll(query?: ICrudOptionPrisma): Promise<{
        row: Service[];
        count: number;
    }> {
        const result = await this.repository.findAndCountAll(query);
        if (!result) {
            throw errorService.error(
                ERROR_MESSAGE.THIS_SKILL_DOES_NOT_EXISTED
            );
        }
        return result;
    }

    async create(serviceCreateInput: Prisma.ServiceCreateInput): Promise<Service> {
        return await this.repository.create(serviceCreateInput);
    }

    async findOne(query?: ICrudOptionPrisma): Promise<Service> {
        const result = await this.repository.findOne(query);
        if (!result) {
            throw errorService.error(
                ERROR_MESSAGE.THIS_SKILL_DOES_NOT_EXISTED
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
                ERROR_MESSAGE.THIS_SKILL_DOES_NOT_EXISTED
            );
        }
        return await this.repository.updateById(serviceId, serviceUpdateInput);
    }
    async deleteByServiceId(serviceId: string): Promise<Service> {
        const result = await this.repository.deleteById(serviceId);
        if (!result) {
            throw errorService.error(
                ERROR_MESSAGE.THIS_SKILL_DOES_NOT_EXISTED
            );
        }
        return result;
    }
}
