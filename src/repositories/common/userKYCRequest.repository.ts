import { ICrudOptionPrisma } from "@/services/base/basePrisma.service";
import {
    BasePrismaRepository,
    PrismaTransaction,
} from "../base/basePrisma.repository";
import { Prisma, UserKYCRequest } from "@prisma/client";

export class UserKYCRequestRepository extends BasePrismaRepository {
    constructor() {
        super();
    }

    async findAndCountAll(query?: ICrudOptionPrisma): Promise<{
        row: UserKYCRequest[];
        count: number;
    }> {
        const [row, count] = await this.prisma.$transaction([
            this.prisma.userKYCRequest.findMany(query),
            this.prisma.userKYCRequest.count({
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
        userKYCRequestUpdateInput: Prisma.UserKYCRequestUpdateInput,
        tx: PrismaTransaction = this.prisma
    ) {
        return await tx.userKYCRequest.update({
            data: userKYCRequestUpdateInput,
            where: { id },
        });
    }

    async update(
        userKYCRequestUpdateInput: Prisma.UserKYCRequestUpdateInput,
        query: ICrudOptionPrisma,
        tx: PrismaTransaction = this.prisma
    ) {
        return await tx.userKYCRequest.update({
            data: userKYCRequestUpdateInput,
            where: query.where,
        });
    }

    async create(
        userKYCRequestCreateInput: Prisma.UserKYCRequestCreateInput,
        tx: PrismaTransaction = this.prisma
    ): Promise<UserKYCRequest> {
        return await tx.userKYCRequest.create({
            data: userKYCRequestCreateInput,
        });
    }

    async findOne(
        query?: ICrudOptionPrisma,
        tx: PrismaTransaction = this.prisma
    ): Promise<UserKYCRequest | null> {
        return await tx.userKYCRequest.findFirst(query);
    }

    async findMany(
        query?: ICrudOptionPrisma,
        tx: PrismaTransaction = this.prisma
    ): Promise<UserKYCRequest[]> {
        return await tx.userKYCRequest.findMany(query);
    }

    async deleteById(
        id: string,
        tx: PrismaTransaction = this.prisma
    ): Promise<UserKYCRequest> {
        return await tx.userKYCRequest.delete({ where: { id } });
    }

    async deleteMany(
        userKYCRequestWhereInput: Prisma.UserKYCRequestWhereInput,
        tx: PrismaTransaction = this.prisma
    ): Promise<Prisma.BatchPayload> {
        return await tx.userKYCRequest.deleteMany({
            where: userKYCRequestWhereInput,
        });
    }
}
