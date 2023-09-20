import { ICrudOptionPrisma } from "@/services/base/basePrisma.service";
import {
    BasePrismaRepository,
    PrismaTransaction,
} from "../base/basePrisma.repository";
import { Prisma, Skill } from "@prisma/client";
import { utilService } from "@/services";
import moment from "moment";

export class SkillRepository extends BasePrismaRepository {
 

    async findAndCountAll(query?: ICrudOptionPrisma): Promise<{
        row: Skill[];
        count: number;
    }> {
        const [row, count] = await this.prisma.$transaction([
            this.prisma.skill.findMany(query),
            this.prisma.skill.count({
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
        skillUpdateInput: Prisma.SkillUpdateInput,
        tx: PrismaTransaction = this.prisma
    ) {
        return await tx.skill.update({ data: skillUpdateInput, where: { id } });
    }

    async update(
        skillUpdateInput: Prisma.SkillUpdateInput,
        query: ICrudOptionPrisma,
        tx: PrismaTransaction = this.prisma
    ) {
        if (skillUpdateInput.name) {
            if (!skillUpdateInput.slug)
                skillUpdateInput.slug = utilService.changeToSlug(
                    skillUpdateInput.name.toString()
                );
            const checkSlugExisted = await this.findOne({
                where: {
                    slug: skillUpdateInput.slug,
                },
            });
            if (checkSlugExisted) {
                skillUpdateInput.slug = utilService.changeToSlug(
                    skillUpdateInput.slug.toString(),
                    moment().format("MMDDYYhhmmss")
                );
            }
        }
        return await tx.skill.update({
            data: skillUpdateInput,
            where: query.where,
        });
    }

    async create(
        skillCreateInput: Prisma.SkillCreateInput,
        tx: PrismaTransaction = this.prisma
    ): Promise<Skill> {
        if (!skillCreateInput.slug)
            skillCreateInput.slug = utilService.changeToSlug(
                skillCreateInput.name
            );
        const checkSlugExisted = await this.findOne({
            where: {
                slug: skillCreateInput.slug,
            },
        });
        if (checkSlugExisted) {
            skillCreateInput.slug = utilService.changeToSlug(
                skillCreateInput.slug,
                moment().format("MMDDYYhhmmss")
            );
        }
        return await tx.skill.create({ data: skillCreateInput });
    }

    async findOne(
        query?: ICrudOptionPrisma,
        tx: PrismaTransaction = this.prisma
    ): Promise<Skill | null> {
        return await tx.skill.findFirst(query);
    }

    async findMany(
        query?: ICrudOptionPrisma,
        tx: PrismaTransaction = this.prisma
    ): Promise<Skill[]> {
        return await tx.skill.findMany(query);
    }

    async deleteById(
        id: string,
        tx: PrismaTransaction = this.prisma
    ): Promise<Skill> {
        return await tx.skill.delete({ where: { id } });
    }

    async deleteMany(
        skillWhereInput: Prisma.SkillWhereInput,
        tx: PrismaTransaction = this.prisma
    ): Promise<Prisma.BatchPayload> {
        return await tx.skill.deleteMany({ where: skillWhereInput });
    }
}
