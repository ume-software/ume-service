
import { UserInfomationResponse } from "@/common/responses/userInfomation.reponse";
import { feedbackRepository } from "@/repositories";
import { userService, utilService } from "@/services";
import {
    BasePrismaService, ICrudOptionPrisma,
} from "@/services/base/basePrisma.service";
import { BookingHistory, Feedback } from "@prisma/client";

type FeedbackByProviderSkillType = (
    Feedback &
    {
        booking?: (
            BookingHistory & {
                booker?: UserInfomationResponse
            }
        );
    }
)
export class FeedbackService extends BasePrismaService<typeof feedbackRepository> {
    constructor() {
        super(feedbackRepository);
    }

    async getFeedbackByProviderSkill(query: ICrudOptionPrisma): Promise<{
        row: FeedbackByProviderSkillType[];
        count: number;
    }> {
        query.include = {
            ...query.include,
            booking: true
        }

        const result = await this.repository.findAndCountAll(query);
        const bookerIds: string[] = result.row.map(item => item.booking?.bookerId) as string[];
        const requestListIds = await userService.getListByUserIds(bookerIds)
        const listUserInfo: Array<UserInfomationResponse> = requestListIds.data.row as Array<UserInfomationResponse>;
        const usersInfo: { [key: string]: UserInfomationResponse } = utilService.convertArrayObjectToObject(listUserInfo);

        result.row.forEach(item => {
            if (item.booking?.bookerId) {
                (item.booking as any).booker = usersInfo[item.booking.bookerId];
            }

        })

        return result;
    }

}