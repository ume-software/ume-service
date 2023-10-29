import { CreateReportUserRequest } from "@/common/requests";
import prisma from "@/models/base.prisma";
import { reportUserRepository, userRepository } from "@/repositories";
import { errorService } from "@/services";
import {
    BasePrismaService,
    ICrudOptionPrisma,
} from "@/services/base/basePrisma.service";
import { ERROR_MESSAGE } from "@/services/errors/errorMessage";

import { ReportUser } from "@prisma/client";
import moment from "moment";
export class ReportUserService extends BasePrismaService<
    typeof reportUserRepository
> {
    constructor() {
        super(reportUserRepository);
    }

    async findAndCountAll(query?: ICrudOptionPrisma): Promise<{
        row: ReportUser[];
        count: number;
    }> {
        return await this.repository.findAndCountAll(query);
    }
    async findOne(query?: ICrudOptionPrisma) {
        return await this.repository.findOne(query);
    }

    async create(
        creatorId: string,
        createNewPostRequest: CreateReportUserRequest
    ): Promise<ReportUser> {
        const { content, reportedUserSlug, reasonType } = createNewPostRequest;
        const user = await userRepository.getByIdOrSlug(reportedUserSlug);
        if (!user) {
            throw errorService.error(ERROR_MESSAGE.USER_NOT_FOUND);
        }
        const reportUserExistedIn24Hours = await prisma.reportUser.findFirst({
            where: {
                reportingUserId: creatorId,
                reportedUserId: user.id,
                createdAt: {
                    gte: moment().subtract(24, "hour").toDate(),
                },
            },
        });
        if (reportUserExistedIn24Hours) {
            throw errorService.error(
                ERROR_MESSAGE.THE_TIME_TO_REPORT_A_USER_NEEDS_TO_BE_24_HOURS_APART
            );
        }
        return await this.repository.create({
            reportingUser: {
                connect: {
                    id: creatorId,
                },
            },
            reportedUser: {
                connect: {
                    id: user.id,
                },
            },
            content,
            reasonType,
        });
    }
}
