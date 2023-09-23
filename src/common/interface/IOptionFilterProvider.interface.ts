import { Gender } from "@prisma/client";

export interface IOptionFilterProvider {
  startCost: number | undefined;
  endCost: number | undefined;
  serviceId: string | undefined;
  name: string | undefined;
  gender: Gender | undefined;
  order: any[] | undefined;
}
