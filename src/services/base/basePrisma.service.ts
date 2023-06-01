import { BasePrismaRepository } from "@/repositories/base/basePrisma.repository";
import { SOCKET_EXPRESS, ServerSocket } from "../socketIO/socketIO.service";
import { Request } from "@/controllers/base/base.controller";

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

    socketIO(req: Request) {
        return req.app.get(SOCKET_EXPRESS) as ServerSocket;
    }
}
