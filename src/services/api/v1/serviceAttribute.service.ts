import {
    serviceAttributeValueRepository,
    serviceAttributeRepository,
} from "@/repositories";
import { errorService } from "@/services";
import {
    BasePrismaService,
    ICrudOptionPrisma,
} from "@/services/base/basePrisma.service";
import { ERROR_MESSAGE } from "@/services/errors/errorMessage";
import { ServiceAttribute } from "@prisma/client";
import _ from "lodash";

export class ServiceAttributeService extends BasePrismaService<
    typeof serviceAttributeRepository
> {
    constructor() {
        super(serviceAttributeRepository);
    }

    async findOne(query?: ICrudOptionPrisma): Promise<ServiceAttribute> {
        const result = await this.repository.findOne(query);
        if (!result) {
            throw errorService.error(ERROR_MESSAGE.THIS_SERVICE_DOES_NOT_EXISTED);
        }
        return result;
    }

    async getServiceAttributeValueByServiceAttributeId(
        id: string,
        query: ICrudOptionPrisma
    ) {
        _.set(query, "where.serviceAttributeId", id);
        return await serviceAttributeValueRepository.findAndCountAll(query);
    }
}
