
import { feedbackRepository } from "@/repositories";
import {
    BasePrismaService,
} from "@/services/base/basePrisma.service";


export class FeedbackService extends BasePrismaService<typeof feedbackRepository> {
    constructor() {
        super(feedbackRepository);
    }


}
