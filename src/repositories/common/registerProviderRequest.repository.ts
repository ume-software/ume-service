import { Prisma, RegisterProviderRequest } from "@prisma/client";

import { ICrudOptionPrisma } from "@/services/base/basePrisma.service";
import { BasePrismaRepository } from "../base/basePrisma.repository";

export class RegisterProviderRequestRepository extends BasePrismaRepository {
    constructor() {
        super();
    }

    async create(
        registerProviderRequestCreateInput: Prisma.RegisterProviderRequestCreateInput
    ): Promise<RegisterProviderRequest> {
        return await this.prisma.registerProviderRequest.create({
            data: registerProviderRequestCreateInput,
        });
    }
    async updateByUserId(
        userId: string,
        registerProviderRequestUpdateInput: Prisma.RegisterProviderRequestUpdateInput
    ): Promise<RegisterProviderRequest> {
        return await this.prisma.registerProviderRequest.update({
            data: registerProviderRequestUpdateInput,
            where: {
                userId,
            },
        });
    }
    async findOne(
        query?: ICrudOptionPrisma
    ): Promise<RegisterProviderRequest | null> {
        return await this.prisma.registerProviderRequest.findFirst(query);
    }

    async findOneByUserId(
        userId: string
    ): Promise<RegisterProviderRequest | null> {
        return await this.prisma.registerProviderRequest.findFirst({
            where: { userId },
        });
    }
}
