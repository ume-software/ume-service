import { Gender } from "@prisma/client";

export interface IOptionFilterProvider {
  startCost: number | undefined;
  endCost: number | undefined;
  skillId: string | undefined;
  name: string | undefined;
  gender: Gender | undefined;
  order: any[] | undefined;
}
