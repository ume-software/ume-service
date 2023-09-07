import { skillRepository } from "@/repositories";
import { errorService } from "@/services";
import {
    BasePrismaService,
    ICrudOptionPrisma,
} from "@/services/base/basePrisma.service";
import { ERROR_MESSAGE } from "@/services/errors/errorMessage";
import { Prisma, Skill } from "@prisma/client";

export class SkillService extends BasePrismaService<typeof skillRepository> {
    constructor() {
        super(skillRepository);
    }
    async findAndCountAll(query?: ICrudOptionPrisma): Promise<{
        row: Skill[];
        count: number;
    }> {
        const result = await this.repository.findAndCountAll(query);
        if (!result) {
            throw errorService.error(
                ERROR_MESSAGE.THIS_SKILL_DOES_NOT_EXISTED
            );
        }
        return result;
    }

    async create(skillCreateInput: Prisma.SkillCreateInput): Promise<Skill> {
        return await this.repository.create(skillCreateInput);
    }

    async findOne(query?: ICrudOptionPrisma): Promise<Skill> {
        const result = await this.repository.findOne(query);
        if (!result) {
            throw errorService.error(
                ERROR_MESSAGE.THIS_SKILL_DOES_NOT_EXISTED
            );
        }
        return result;
    }

    async updateSkillById(
        skillId: string,
        skillUpdateInput: Prisma.SkillUpdateInput
    ) {
        const skill = await this.repository.findOne({
            where: { id: skillId },
        });
        if (!skill) {
            throw errorService.error(
                ERROR_MESSAGE.THIS_SKILL_DOES_NOT_EXISTED
            );
        }
        return await this.repository.updateById(skillId, skillUpdateInput);
    }
    async deleteBySkillId(skillId: string): Promise<Skill> {
        const result = await this.repository.deleteById(skillId);
        if (!result) {
            throw errorService.error(
                ERROR_MESSAGE.THIS_SKILL_DOES_NOT_EXISTED
            );
        }
        return result;
    }
}
