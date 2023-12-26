import { CreateNewInstantCardRequest } from "@/common/requests";
import prisma from "@/models/base.prisma";
import { instantCardRepository } from "@/repositories";
import {
    BasePrismaService,
    ICrudOptionPrisma,
} from "@/services/base/basePrisma.service";
import _ from "lodash";

export class InstantCardService extends BasePrismaService<
    typeof instantCardRepository
> {
    constructor() {
        super(instantCardRepository);
    }
    async create(createNewInstantCardRequest: CreateNewInstantCardRequest) {
        return await prisma.$transaction(async (tx) => {
            const { content, gradientColors, userId } =
                createNewInstantCardRequest;

            const instantCard = await tx.instantCard.create({
                data: {
                    content,
                    gradientColors,
                    user: {
                        connect: {
                            id: userId,
                        },
                    },
                },
            });

            for (const hashTagForInstantCard of createNewInstantCardRequest.hashTags) {
                let hashTag = await tx.hashTag.findFirst({
                    where: {
                        content: hashTagForInstantCard.trim(),
                    },
                });
                if (!hashTag) {
                    hashTag = await tx.hashTag.create({
                        data: {
                            content: hashTagForInstantCard.trim(),
                        },
                    });
                }
                await tx.instantCardHashTag.create({
                    data: {
                        instantCard: {
                            connect: {
                                id: instantCard.id,
                            },
                        },
                        hashTag: {
                            connect: {
                                id: hashTag.id,
                            },
                        },
                    },
                });
            }

            return await tx.instantCard.findFirst({
                where: {
                    id: instantCard.id,
                },
                include: {
                    instantCardHashTag: {
                        include: {
                            hashTag: true,
                        },
                        where: {
                            deletedAt: null,
                        },
                    },
                },
            });
        });
    }
    async findAndCountAll(query: ICrudOptionPrisma) {
        _.set(
            query,
            "where.createdAt.gte",
            new Date(new Date().getTime() - 30 * 60000)
        );
        _.set(query, "include.user.gte", {
            select: {
                id: true,
                name: true,
                avatarUrl: true,
                dob: true,
                slug: true,
                gender: true,
                isOnline: true,
            },
        });

        return await this.repository.findAndCountAll(query);
    }
    async findOne(query?: ICrudOptionPrisma) {
        return await this.repository.findOne(query);
    }
}
