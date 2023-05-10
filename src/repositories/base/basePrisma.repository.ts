import prisma from "@/models/base.prisma";
import { Prisma, PrismaClient } from "@prisma/client";
type Omit<T, K extends keyof any> = Pick<T, Exclude<keyof T, K>>;
export type PrismaTransation = Omit<
  PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use"
>;
export class BasePrismaRepository {
  constructor() {
    this.prisma = prisma;
  }
  prisma: PrismaClient;
}
