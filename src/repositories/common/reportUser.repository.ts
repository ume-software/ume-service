import { ICrudOptionPrisma } from "@/services/base/basePrisma.service";
import {
    BasePrismaRepository,
    PrismaTransaction,
} from "../base/basePrisma.repository";
import { Prisma, ReportUser } from "@prisma/client";

export class ReportUserRepository extends BasePrismaRepository {
    constructor() {
        super();
    }

    async findAndCountAll(query?: ICrudOptionPrisma): Promise<{
        row: ReportUser[];
        count: number;
    }> {
        const [row, count] = await this.prisma.$transaction([
            this.prisma.reportUser.findMany(query),
            this.prisma.reportUser.count({
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
        reportUserUpdateInput: Prisma.ReportUserUpdateInput,
        tx: PrismaTransaction = this.prisma
    ) {
        return await tx.reportUser.update({
            data: reportUserUpdateInput,
            where: { id },
        });
    }

    async update(
        reportUserUpdateInput: Prisma.ReportUserUpdateInput,
        query: ICrudOptionPrisma,
        tx: PrismaTransaction = this.prisma
    ) {
        return await tx.reportUser.update({
            data: reportUserUpdateInput,
            where: query.where,
        });
    }

    async create(
        reportUserCreateInput: Prisma.ReportUserCreateInput,
        tx: PrismaTransaction = this.prisma
    ): Promise<ReportUser> {
        return await tx.reportUser.create({ data: reportUserCreateInput });
    }

    async findOne(
        query?: ICrudOptionPrisma,
        tx: PrismaTransaction = this.prisma
    ): Promise<ReportUser | null> {
        return await tx.reportUser.findFirst(query);
    }

    async findMany(
        query?: ICrudOptionPrisma,
        tx: PrismaTransaction = this.prisma
    ): Promise<ReportUser[]> {
        return await tx.reportUser.findMany(query);
    }

    async deleteById(
        id: string,
        tx: PrismaTransaction = this.prisma
    ): Promise<ReportUser> {
        return await tx.reportUser.delete({ where: { id } });
    }

    async deleteMany(
        ReportUserWhereInput: Prisma.ReportUserWhereInput,
        tx: PrismaTransaction = this.prisma
    ): Promise<Prisma.BatchPayload> {
        return await tx.reportUser.deleteMany({ where: ReportUserWhereInput });
    }

    async destroyByUserIdAndPostId(userId: string, postId: string) {
        const query = `DELETE FROM like_post WHERE post_id='${postId}' AND user_id='${userId}';`;
        return await this.prisma.$queryRawUnsafe(query);
    }

    async destroyById(id: string) {
        const query = `DELETE FROM like_post WHERE id='${id}';`;
        return await this.prisma.$queryRawUnsafe(query);
    }
}
