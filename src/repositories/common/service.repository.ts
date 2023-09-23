import { ICrudOptionPrisma } from "@/services/base/basePrisma.service";
import {
    BasePrismaRepository,
    PrismaTransaction,
} from "../base/basePrisma.repository";
import { Prisma, Service } from "@prisma/client";
import { utilService } from "@/services";
import moment from "moment";

export class ServiceRepository extends BasePrismaRepository {
 

    async findAndCountAll(query?: ICrudOptionPrisma): Promise<{
        row: Service[];
        count: number;
    }> {
        const [row, count] = await this.prisma.$transaction([
            this.prisma.service.findMany(query),
            this.prisma.service.count({
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
        serviceUpdateInput: Prisma.ServiceUpdateInput,
        tx: PrismaTransaction = this.prisma
    ) {
        return await tx.service.update({ data: serviceUpdateInput, where: { id } });
    }

    async update(
        serviceUpdateInput: Prisma.ServiceUpdateInput,
        query: ICrudOptionPrisma,
        tx: PrismaTransaction = this.prisma
    ) {
        if (serviceUpdateInput.name) {
            if (!serviceUpdateInput.slug)
                serviceUpdateInput.slug = utilService.changeToSlug(
                    serviceUpdateInput.name.toString()
                );
            const checkSlugExisted = await this.findOne({
                where: {
                    slug: serviceUpdateInput.slug,
                },
            });
            if (checkSlugExisted) {
                serviceUpdateInput.slug = utilService.changeToSlug(
                    serviceUpdateInput.slug.toString(),
                    moment().format("MMDDYYhhmmss")
                );
            }
        }
        return await tx.service.update({
            data: serviceUpdateInput,
            where: query.where,
        });
    }

    async create(
        serviceCreateInput: Prisma.ServiceCreateInput,
        tx: PrismaTransaction = this.prisma
    ): Promise<Service> {
        if (!serviceCreateInput.slug)
            serviceCreateInput.slug = utilService.changeToSlug(
                serviceCreateInput.name
            );
        const checkSlugExisted = await this.findOne({
            where: {
                slug: serviceCreateInput.slug,
            },
        });
        if (checkSlugExisted) {
            serviceCreateInput.slug = utilService.changeToSlug(
                serviceCreateInput.slug,
                moment().format("MMDDYYhhmmss")
            );
        }
        return await tx.service.create({ data: serviceCreateInput });
    }

    async findOne(
        query?: ICrudOptionPrisma,
        tx: PrismaTransaction = this.prisma
    ): Promise<Service | null> {
        return await tx.service.findFirst(query);
    }

    async findMany(
        query?: ICrudOptionPrisma,
        tx: PrismaTransaction = this.prisma
    ): Promise<Service[]> {
        return await tx.service.findMany(query);
    }

    async deleteById(
        id: string,
        tx: PrismaTransaction = this.prisma
    ): Promise<Service> {
        return await tx.service.delete({ where: { id } });
    }

    async deleteMany(
        serviceWhereInput: Prisma.ServiceWhereInput,
        tx: PrismaTransaction = this.prisma
    ): Promise<Prisma.BatchPayload> {
        return await tx.service.deleteMany({ where: serviceWhereInput });
    }
}
