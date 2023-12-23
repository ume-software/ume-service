import { hashTagRepository } from "@/repositories";
import { BasePrismaService } from "@/services/base/basePrisma.service";

export class HashTagService extends BasePrismaService<
    typeof hashTagRepository
> {
    constructor() {
        super(hashTagRepository);
    }

    async getTopInstantCardHashTags(top: number) {
        return await this.repository.findAndCountAll({
            orderBy: {
                instantCardHashTag: {
                    _count: "desc",
                },
            },
            take: top,
        });
    }
}
