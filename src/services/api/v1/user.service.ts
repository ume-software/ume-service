import { userRepository } from "@/repositories";
import { BasePrismaService, ICrudOptionPrisma } from "@/services/base/basePrisma.service";
import { Prisma, User } from "@prisma/client";



export class UserService extends BasePrismaService<typeof userRepository> {
    constructor() {
        super(userRepository);
    }

    async create(userCreateInput: Prisma.UserCreateInput): Promise<User> {
        return await this.repository.create(userCreateInput);
    }

    async findOne(query?: ICrudOptionPrisma): Promise<User | null> {
        return await this.repository.findOne(query);
    }

    
}
