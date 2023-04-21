import { skillRepository } from "@/repositories";
import { errorService } from "@/services";
import { BasePrismaService, ICrudOptionPrisma } from "@/services/base/basePrisma.service";
import { ERROR_MESSAGE } from "@/services/errors/errorMessage";
import { Prisma, Skill } from "@prisma/client";



export class SkillService extends BasePrismaService<typeof skillRepository> {
    constructor() {
        super(skillRepository);
    }

    async create(SkillCreateInput: Prisma.SkillCreateInput): Promise<Skill> {
        return await this.repository.create(SkillCreateInput);
    }

    async findOne(query?: ICrudOptionPrisma): Promise<Skill> {
        const result = await this.repository.findOne(query);
        if (!result) {
            throw errorService.database.queryFail(ERROR_MESSAGE.THIS_SKILL_DOES_NOT_EXISTED)
        }
        return result;
    }

    async deleteBySkillId(skillId: string): Promise<Skill> {
        const result = await this.repository.deleteById(skillId);
        if (!result) {
            throw errorService.database.queryFail(ERROR_MESSAGE.THIS_SKILL_DOES_NOT_EXISTED)
        }
        return result;
    }


}
