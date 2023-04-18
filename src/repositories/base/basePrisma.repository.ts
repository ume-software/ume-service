import prisma from "@/models/base.prisma";
import { PrismaClient } from "@prisma/client";

export class BasePrismaRepository {
    constructor() {
        this.prisma = prisma;
    };
    prisma: PrismaClient
}