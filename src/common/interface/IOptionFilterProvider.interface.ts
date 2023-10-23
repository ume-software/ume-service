import { Gender, ProviderStatus } from "@prisma/client";

export interface IOptionFilterProvider {
    startCost: number | undefined;
    endCost: number | undefined;
    serviceId: string | undefined;
    serviceAttributeValueIds: string[] | undefined;
    name: string | undefined;
    gender: Gender | undefined;
    order: any[] | undefined;
    status: ProviderStatus;
}
