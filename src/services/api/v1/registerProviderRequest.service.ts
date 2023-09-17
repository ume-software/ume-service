import { UserRegisterBecomeProviderRequest } from "@/common/requests";
import { RegisterBecomeProviderResponse } from "@/common/responses";
import {
    providerRepository,
    registerProviderRequestRepository,
} from "@/repositories";
import { errorService } from "@/services";
import { BasePrismaService } from "@/services/base/basePrisma.service";
import { ERROR_MESSAGE } from "@/services/errors/errorMessage";
import { RegisterProviderRequestStatus } from "@prisma/client";

export class RegisterProviderRequestService extends BasePrismaService<
    typeof registerProviderRequestRepository
> {
    constructor() {
        super(registerProviderRequestRepository);
    }

    async userRegisterBecomeProvider(
        userId: string,
        userRegisterBecomeProviderRequest: UserRegisterBecomeProviderRequest
    ): Promise<RegisterBecomeProviderResponse> {
        const preExistingProvider = await providerRepository.findOne({
            where: {
                userId,
            },
        });
        if (preExistingProvider) {
            throw errorService.error(ERROR_MESSAGE.YOU_ARE_ALREADY_A_PROVIDER);
        }
        const preExistingRegisterProviderProviderPending =
            await this.repository.findOne({
                where: {
                    userId,
                    status: RegisterProviderRequestStatus.PENDING,
                },
            });
        if (preExistingRegisterProviderProviderPending) {
            throw errorService.error(
                ERROR_MESSAGE.YOU_HAVE_A_REQUEST_TO_BECOME_A_SUPPLIER_PENDING_APPROVAL
            );
        }
        if (userRegisterBecomeProviderRequest.slug) {
            const checkSlugExisted = await Promise.all([
                !!(await this.repository.findOne({
                    where: {
                        slug: userRegisterBecomeProviderRequest.slug,
                        status: { not: RegisterProviderRequestStatus.PENDING },
                    },
                })),
                !!(await providerRepository.findOne({
                    where: {
                        slug: userRegisterBecomeProviderRequest.slug,
                    },
                })),
            ]);

            if (checkSlugExisted.includes(true)) {
                throw errorService.error(
                    ERROR_MESSAGE.THIS_SLUG_ALREADY_EXISTS_AT_ANOTHER_PROVIDER
                );
            }
        }

        const result = await this.repository.create({
            user: {
                connect: {
                    id: userId,
                },
            },
            ...userRegisterBecomeProviderRequest,
        });
        return result as RegisterBecomeProviderResponse;
    }
}
