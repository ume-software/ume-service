import { CreateBannerRequest, UpdateBannerRequest } from "@/common/requests";
import prisma from "@/models/base.prisma";
import { bannerRepository } from "@/repositories";
import { errorService } from "@/services";
import {
    BasePrismaService,
    ICrudOptionPrisma,
} from "@/services/base/basePrisma.service";
import { Banner, Prisma } from "@prisma/client";

export class BannerService extends BasePrismaService<typeof bannerRepository> {
    constructor() {
        super(bannerRepository);
    }
    async create(bannerCreateInput: CreateBannerRequest): Promise<Banner> {
        return prisma.$transaction(async (tx) => {
            await this.repository.updateMany(
                { position: { increment: 1 } },
                { where: { deletedAt: null } },
                tx
            );
            return await this.repository.create(
                {
                    position: 1,
                    ...(bannerCreateInput as Prisma.BannerCreateInput),
                },
                tx
            );
        });
    }

    async findAndCountAll(query?: ICrudOptionPrisma) {
        return await this.repository.findAndCountAll(query);
    }
    async findOne(query?: ICrudOptionPrisma) {
        return await this.repository.findOne(query);
    }
    async updateById(id: string, updateBannerRequest: UpdateBannerRequest) {
        const banner = await this.findOne({ where: { id } });
        if (!banner) {
            throw errorService.recordNotFound();
        }
        return prisma.$transaction(async (tx) => {
            if (
                updateBannerRequest.position && // 4
                updateBannerRequest.position < banner.position! //10
            ) {
                await this.repository.updateMany(
                    { position: { increment: 1 } },
                    {
                        where: {
                            position: {
                                gte: updateBannerRequest.position,
                                lt: banner.position,
                            },
                        },
                    },
                    tx
                );
            } else if (
                updateBannerRequest.position &&
                updateBannerRequest.position > banner.position!
            ) {
                await this.repository.updateMany(
                    { position: { decrement: 1 } },
                    {
                        where: {
                            position: {
                                gte: banner.position,
                                lt: updateBannerRequest.position,
                            },
                        },
                    },
                    tx
                );
            }

            return await this.repository.updateById(
                id,
                updateBannerRequest as Prisma.BannerUpdateInput,
                tx
            );
        });
    }

    async deleteById(id: string) {
        const banner = await this.findOne({ where: { id } });
        if (!banner) {
            throw errorService.recordNotFound();
        }
        return prisma.$transaction(async (tx) => {
            await this.repository.updateMany(
                { position: { decrement: 1 } },
                {
                    where: {
                        position: {
                            gte: banner.position,
                        },
                    },
                },
                tx
            );

            return await this.repository.updateById(
                id,
                { position: null, deletedAt: new Date() },
                tx
            );
        });
    }
}
