import { BookingCostRepository } from "./common/bookingCost.repository";
import { BookingHistoryRepository } from "./common/bookingHistory.repository";
import { CoinHistoryRepository } from "./common/coinHistory.repository";
import { ProviderRepository } from "./common/provider.repository";
import { ProviderSkillRepository } from "./common/providerSkill.repository";
import { SkillRepository } from "./common/skill.repository";
import { UserRepository } from "./common/user.repository";
import { FeedbackRepository } from "./common/feedback.repository";
import { BuyCoinRequestRepository } from "./common/buyCoinRequest.repository";
import { CoinSettingRepository } from "./common/coinSetting.repository";
import { PostRepository } from "./common/post.repository";
import { CommentPostRepository } from "./common/commentPost.repository";
import { LikePostRepository } from "./common/likePost.repository";
import { WatchedPostRepository } from "./common/watchedPost.repository";

const bookingCostRepository = new BookingCostRepository();
const bookingHistoryRepository = new BookingHistoryRepository();
const coinHistoryRepository = new CoinHistoryRepository();
const providerRepository = new ProviderRepository();
const providerSkillRepository = new ProviderSkillRepository();
const skillRepository = new SkillRepository();
const userRepository = new UserRepository();
const feedbackRepository = new FeedbackRepository();
const buyCoinRequestRepository = new BuyCoinRequestRepository();
const coinSettingRepository = new CoinSettingRepository();
const postRepository = new PostRepository();
const commentPostRepository = new CommentPostRepository();
const likePostRepository = new LikePostRepository();
const watchedPostRepository = new WatchedPostRepository();

export {
    bookingCostRepository,
    bookingHistoryRepository,
    coinHistoryRepository,
    providerRepository,
    providerSkillRepository,
    skillRepository,
    userRepository,
    feedbackRepository,
    buyCoinRequestRepository,
    coinSettingRepository,
    postRepository,
    commentPostRepository,
    likePostRepository,
    watchedPostRepository
}