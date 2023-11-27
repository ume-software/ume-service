import { ICrudOptionPrisma } from "@/services/base/basePrisma.service";
import {
    BasePrismaRepository,
    PrismaTransaction,
} from "../base/basePrisma.repository";
import { Prisma, Banner } from "@prisma/client";

export class BannerRepository extends BasePrismaRepository {
    async findAndCountAll(query: ICrudOptionPrisma = {}): Promise<{
        row: Banner[];
        count: number;
    }> {
        const { include, ...queryData } = query;
        const [row, count] = await this.prisma.$transaction([
            this.prisma.banner.findMany(queryData),
            this.prisma.banner.count({
                where: queryData?.where,
            }),
        ]);
        return {
            row,
            count,
        };
    }
    async count(
        query: ICrudOptionPrisma = {},
        tx: PrismaTransaction = this.prisma
    ): Promise<number> {
        return tx.banner.count({
            where: query?.where,
        });
    }
    async updateById(
        id: string,
        bannerUpdateInput: Prisma.BannerUpdateInput,
        tx: PrismaTransaction = this.prisma
    ) {
        return await tx.banner.update({
            data: bannerUpdateInput,
            where: { id },
        });
    }

    async updateMany(
        bannerUpdateInput: Prisma.BannerUpdateInput,
        query: ICrudOptionPrisma,
        tx: PrismaTransaction = this.prisma
    ) {
        return await tx.banner.updateMany({
            data: bannerUpdateInput,
            where: query.where,
        });
    }

    async create(
        BannerCreateInput: Prisma.BannerCreateInput,
        tx: PrismaTransaction = this.prisma
    ): Promise<Banner> {
        return await tx.banner.create({
            data: BannerCreateInput,
        });
    }

    async findOne(
        query: ICrudOptionPrisma = {},
        tx: PrismaTransaction = this.prisma
    ): Promise<Banner | null> {
        const { include, ...queryData } = query;
        return await tx.banner.findFirst(queryData);
    }

    async findById(
        id: string,
        tx: PrismaTransaction = this.prisma
    ): Promise<Banner | null> {
        return await tx.banner.findFirst({
            where: {
                id,
            },
        });
    }

    async findMany(
        query: ICrudOptionPrisma = {},
        tx: PrismaTransaction = this.prisma
    ): Promise<Banner[]> {
        const { include, ...queryData } = query;
        return await tx.banner.findMany(queryData);
    }

    async deleteById(
        id: string,
        tx: PrismaTransaction = this.prisma
    ): Promise<Banner> {
        return await tx.banner.delete({ where: { id } });
    }

    async deleteMany(
        bannerWhereInput: Prisma.BannerWhereInput,
        tx: PrismaTransaction = this.prisma
    ): Promise<Prisma.BatchPayload> {
        return await tx.banner.deleteMany({
            where: bannerWhereInput,
        });
    }
}
