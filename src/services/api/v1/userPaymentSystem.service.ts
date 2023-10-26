import { UserPaymentSystemRequest } from "@/common/requests/userPaymentSystem";
import { userPaymentSystemRepository } from "@/repositories";
import {
    BasePrismaService,
    ICrudOptionPrisma,
} from "@/services/base/basePrisma.service";
import { UserPaymentSystem } from "@prisma/client";

export class UserPaymentSystemService extends BasePrismaService<
    typeof userPaymentSystemRepository
> {
    constructor() {
        super(userPaymentSystemRepository);
    }
    async create(
        userPaymentSystemRequest: UserPaymentSystemRequest
    ): Promise<UserPaymentSystem> {
        const { beneficiary, platform, platformAccount, userId } =
            userPaymentSystemRequest;
        return await this.repository.create({
            user: {
                connect: {
                    id: userId,
                },
            },
            beneficiary,
            platform,
            platformAccount,
        });
    }

    async findMany(query?: ICrudOptionPrisma) {
        return await this.repository.findMany(query);
    }

    async findOne(
        query?: ICrudOptionPrisma
    ): Promise<UserPaymentSystem | null> {
        return await this.repository.findOne(query);
    }

    async findAndCountAll(query?: ICrudOptionPrisma) {
        return await this.repository.findAndCountAll(query);
    }
}
