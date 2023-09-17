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
import { NoticeRepository } from "./common/notice.repository";
import { DonateProviderRepository } from "./common/donateProvider.repository";
import { VoucherRepository } from "./common/voucher.repository";
import { VoucherRedeemedBookingRepository } from "./common/voucherRedeemedBooking.repository";
import { RefreshTokenUserRepository } from "./common/refreshTokenUser.repository";
import { RefreshTokenAdminRepository } from "./common/refreshTokenAdmin.repository";
import { AdminRepository } from "./common/admin.repository";
import { PaymentQrSettingRepository } from "./common/paymentQrSetting.repository";
import { AdminPaymentSystemRepository } from "./common/adminPaymentSystem.repository";
import { AdminRoleRepository } from "./common/adminRole.repository";
import { RegisterProviderRequestRepository } from "./common/registerProviderRequest.repository";

const bookingCostRepository = new BookingCostRepository();
const bookingHistoryRepository = new BookingHistoryRepository();
const coinHistoryRepository = new CoinHistoryRepository();
const providerRepository = new ProviderRepository();
const providerSkillRepository = new ProviderSkillRepository();
const skillRepository = new SkillRepository();
const userRepository = new UserRepository();
const refreshTokenUserRepository = new RefreshTokenUserRepository();
const adminRepository = new AdminRepository();
const adminRoleRepository = new AdminRoleRepository();
const refreshTokenAdminRepository = new RefreshTokenAdminRepository();
const adminPaymentSystemRepository = new AdminPaymentSystemRepository();
const feedbackRepository = new FeedbackRepository();
const buyCoinRequestRepository = new BuyCoinRequestRepository();
const coinSettingRepository = new CoinSettingRepository();
const postRepository = new PostRepository();
const commentPostRepository = new CommentPostRepository();
const likePostRepository = new LikePostRepository();
const watchedPostRepository = new WatchedPostRepository();
const noticeRepository = new NoticeRepository();
const donateProviderRepository = new DonateProviderRepository();
const voucherRepository = new VoucherRepository();
const voucherRedeemedBookingRepository = new VoucherRedeemedBookingRepository();
const paymentQrSettingRepository = new PaymentQrSettingRepository();
const registerProviderRequestRepository =
    new RegisterProviderRequestRepository();
export {
    bookingCostRepository,
    bookingHistoryRepository,
    coinHistoryRepository,
    providerRepository,
    providerSkillRepository,
    skillRepository,
    userRepository,
    adminRoleRepository,
    refreshTokenUserRepository,
    adminRepository,
    adminPaymentSystemRepository,
    refreshTokenAdminRepository,
    feedbackRepository,
    buyCoinRequestRepository,
    coinSettingRepository,
    postRepository,
    commentPostRepository,
    likePostRepository,
    watchedPostRepository,
    noticeRepository,
    donateProviderRepository,
    voucherRepository,
    voucherRedeemedBookingRepository,
    paymentQrSettingRepository,
    registerProviderRequestRepository,
};
