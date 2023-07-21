import prisma from "@/models/base.prisma";
import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
export type PrismaTransation = Omit<
  PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    DefaultArgs

  >,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;
export class BasePrismaRepository {
  constructor() {
    this.prisma = prisma;
  }
  prisma: PrismaClient;
}
