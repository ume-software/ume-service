import { ICrudOptionPrisma } from "@/services/base/basePrisma.service";
import { BasePrismaRepository, PrismaTransaction } from "../base/basePrisma.repository";
import { Prisma, User } from "@prisma/client";

export class UserRepository extends BasePrismaRepository {
  constructor() {
    super();
  }

  async findAndCountAll(query?: ICrudOptionPrisma): Promise<{
    row: User[];
    count: number;
  }> {
    const [row, count] = await this.prisma.$transaction([
      this.prisma.user.findMany(query),
      this.prisma.user.count({
        where: query?.where,
      }),
    ]);
    return {
      row,
      count,
    };
  }
  async upsertById(
    userCreateInput: Prisma.UserCreateInput,
    tx: PrismaTransaction = this.prisma
  ): Promise<User> {
    let user = await tx.user.findFirst({ where: { id: userCreateInput.id!! } });
    if (!user) {
      user = await tx.user.create({
        data: userCreateInput,
      });
    } else {
      user = await tx.user.update({
        where: {
          id: userCreateInput.id!!,
        },
        data: userCreateInput,
      });
    }
    return user;
  }

  async updateById(
    id: string,
    bookingCostUpdateInput: Prisma.BookingCostUpdateInput,
    tx: PrismaTransaction = this.prisma
  ): Promise<User> {
    return await tx.user.update({
      data: bookingCostUpdateInput,
      where: { id },
    });
  }

  async updateMany(
    userUpdateInput: Prisma.UserUpdateInput,
    query: ICrudOptionPrisma,
    tx: PrismaTransaction = this.prisma
  ): Promise<Prisma.PrismaPromise<Prisma.BatchPayload>> {
    return await tx.user.updateMany({
      data: userUpdateInput,
      where: query.where,
    });
  }

  async create(
    userCreateInput: Prisma.UserCreateInput,
    tx: PrismaTransaction = this.prisma
  ): Promise<User> {
    return await tx.user.create({ data: userCreateInput });
  }

  async findOne(
    query?: ICrudOptionPrisma,
    tx: PrismaTransaction = this.prisma
  ): Promise<User | null> {
    return await tx.user.findFirst(query);
  }

  async findMany(
    query?: ICrudOptionPrisma,
    tx: PrismaTransaction = this.prisma
  ): Promise<User[]> {
    return await tx.user.findMany(query);
  }

  async deleteById(
    id: string,
    tx: PrismaTransaction = this.prisma
  ): Promise<User> {
    return await tx.user.delete({ where: { id } });
  }

  async deleteMany(
    userWhereInput: Prisma.UserWhereInput,
    tx: PrismaTransaction = this.prisma
  ): Promise<Prisma.BatchPayload> {
    return await tx.user.deleteMany({ where: userWhereInput });
  }
}
