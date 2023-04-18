import { BasePrismaRepository } from "@/repositories/base/basePrisma.repository";

export interface ICrudOptionPrisma {
    select?: any;
    include?: any;
    where?: any;
    orderBy?: any;
    cursor?: any;
    take?: number;
    skip?: number;
    distinct?: any;
}

export class BasePrismaService<T extends BasePrismaRepository> {
    constructor(repository: T) {
        this.repository = repository
    }
    repository: T
}
