import { BookingCostRepository } from "./common/bookingCost.repository";
import { BookingHistoryRepository } from "./common/bookingHistory.repository";
import { CoinHistoryRepository } from "./common/coinHistory.repository";
import { ProviderRepository } from "./common/provider.repository";
import { ProviderSkillRepository } from "./common/providerSkill.repository";
import { SkillRepository } from "./common/skill.repository";
import { UserRepository } from "./common/user.repository";
import { FeedbackRepository } from "./common/feedback.repository";

const bookingCostRepository = new BookingCostRepository();
const bookingHistoryRepository = new BookingHistoryRepository();
const coinHistoryRepository = new CoinHistoryRepository();
const providerRepository = new ProviderRepository();
const providerSkillRepository = new ProviderSkillRepository();
const skillRepository = new SkillRepository();
const userRepository = new UserRepository();
const feedbackRepository = new FeedbackRepository();
export {
    bookingCostRepository,
    bookingHistoryRepository,
    coinHistoryRepository,
    providerRepository,
    providerSkillRepository,
    skillRepository,
    userRepository,
    feedbackRepository
}