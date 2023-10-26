import { ICrudOptionPrisma } from "@/services/base/basePrisma.service";
import {
  BasePrismaRepository,
  PrismaTransaction,
} from "../base/basePrisma.repository";
import { Prisma, UserPaymentSystem } from "@prisma/client";


export class UserPaymentSystemRepository extends BasePrismaRepository {
  constructor() {
    super();
  }

  async findAndCountAll(query?: ICrudOptionPrisma): Promise<{
    row: UserPaymentSystem[];
    count: number;
  }> {
    const [row, count] = await this.prisma.$transaction([
      this.prisma.userPaymentSystem.findMany(query),
      this.prisma.userPaymentSystem.count({
        where: query?.where,
      }),
    ]);
    return {
      row,
      count,
    };
  }

  async updateById(
    id: string,
    userPaymentSystemUpdateInput: Prisma.UserPaymentSystemUpdateInput,
    tx: PrismaTransaction = this.prisma
  ) {
    return await tx.userPaymentSystem.update({ data: userPaymentSystemUpdateInput, where: { id } });
  }

  async update(
    userPaymentSystemUpdateInput: Prisma.UserPaymentSystemUpdateInput,
    query: ICrudOptionPrisma,
    tx: PrismaTransaction = this.prisma
  ) {
    return await tx.userPaymentSystem.update({
      data: userPaymentSystemUpdateInput,
      where: query.where,
    });
  }

  async create(
    UserPaymentSystemCreateInput: Prisma.UserPaymentSystemCreateInput,
    tx: PrismaTransaction = this.prisma
  ): Promise<UserPaymentSystem> {
    return await tx.userPaymentSystem.create({ data: UserPaymentSystemCreateInput });
  }

  async findOne(
    query?: ICrudOptionPrisma,
    tx: PrismaTransaction = this.prisma
  ): Promise<UserPaymentSystem | null> {
    return await tx.userPaymentSystem.findFirst(query);
  }

  async findById(
    id: string,
    tx: PrismaTransaction = this.prisma
  ): Promise<UserPaymentSystem | null> {

    return await tx.userPaymentSystem.findFirst({
      where: {
        id
      }
    });
  }

  async findMany(
    query?: ICrudOptionPrisma,
    tx: PrismaTransaction = this.prisma
  ): Promise<UserPaymentSystem[]> {
    return await tx.userPaymentSystem.findMany(query);
  }

  async deleteById(
    id: string,
    tx: PrismaTransaction = this.prisma
  ): Promise<UserPaymentSystem> {
    return await tx.userPaymentSystem.delete({ where: { id } });
  }

  async deleteMany(
    userPaymentSystemWhereInput: Prisma.UserPaymentSystemWhereInput,
    tx: PrismaTransaction = this.prisma
  ): Promise<Prisma.BatchPayload> {
    return await tx.userPaymentSystem.deleteMany({ where: userPaymentSystemWhereInput });
  }
}
