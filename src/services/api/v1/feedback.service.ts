
import { UserInfomationResponse } from "@/common/responses/userInfomation.reponse";
import { config } from "@/configs";
import { feedbackRepository } from "@/repositories";
import { utilService } from "@/services";
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
        const bookerIds = result.row.map(item => item.booking?.bookerId);
        const requestListIds = await utilService
            .fetch(config.service.identity.url, {
                headers: {
                    common: {
                        key: Buffer.from(config.service.identity.public_key).toString('base64')
                    }
                }
            })
            .post("system/user/get-list-user-by-ids", {
                ids: bookerIds
            });
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