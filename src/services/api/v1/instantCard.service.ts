import { CreateNewInstantCardRequest } from "@/common/requests";
import prisma from "@/models/base.prisma";
import {
    hashTagRepository,
    instantCardHashTagRepository,
    instantCardRepository,
} from "@/repositories";
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

            const instantCard = await instantCardRepository.create(
                {
                    content,
                    gradientColors,
                    user: {
                        connect: {
                            id: userId,
                        },
                    },
                },
                tx
            );

            for (const hashTagForInstantCard of createNewInstantCardRequest.hashTags) {
                let hashTag = await hashTagRepository.findOne(
                    {
                        where: {
                            content: hashTagForInstantCard.trim(),
                        },
                    },
                    tx
                );
                if (!hashTag) {
                    hashTag = await hashTagRepository.create(
                        {
                            content: hashTagForInstantCard.trim(),
                        },
                        tx
                    );
                }
                await instantCardHashTagRepository.create(
                    {
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
                    tx
                );
            }

            return await this.repository.findOne(
                {
                    where: {
                        id: instantCard.id,
                    },
                    include: {
                        instantCardHashTags: {
                            include: {
                                hashTag: true,
                            },
                            where: {
                                deletedAt: null,
                            },
                        },
                    },
                },
                tx
            );
        });
    }
    async findAndCountAll(query: ICrudOptionPrisma) {
        _.set(
            query,
            "where.createdAt.gte",
            new Date(new Date().getTime() - 30 * 60000)
        );
        _.set(query, "include", {
            user: {
                select: {
                    id: true,
                    name: true,
                    avatarUrl: true,
                    dob: true,
                    slug: true,
                    gender: true,
                    isOnline: true,
                },
            },
            instantCardHashTags: {
                include: {
                    hashTag: true,
                },
                where: {
                    deletedAt: null,
                },
            },
        });

        return await this.repository.findAndCountAll(query);
    }
    async findOne(query?: ICrudOptionPrisma) {
        return await this.repository.findOne(query);
    }
}
