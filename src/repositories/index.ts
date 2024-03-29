import { BookingCostRepository } from "./common/bookingCost.repository";
import { BookingHistoryRepository } from "./common/bookingHistory.repository";
import { BalanceHistoryRepository } from "./common/balanceHistory.repository";
import { ProviderRepository } from "./common/provider.repository";
import { ProviderServiceRepository } from "./common/providerService.repository";
import { ServiceRepository } from "./common/service.repository";
import { UserRepository } from "./common/user.repository";
import { FeedbackRepository } from "./common/feedback.repository";
import { DepositRequestRepository } from "./common/depositRequest.repository";
import { BalanceSettingRepository } from "./common/balanceSetting.repository";
import { PostRepository } from "./common/post.repository";
import { CommentPostRepository } from "./common/commentPost.repository";
import { LikePostRepository } from "./common/likePost.repository";
import { WatchedPostRepository } from "./common/watchedPost.repository";
import { NoticeRepository } from "./common/notice.repository";
import { DonationRepository } from "./common/donation.repository";
import { VoucherRepository } from "./common/voucher.repository";
import { VoucherRedeemedBookingRepository } from "./common/voucherRedeemedBooking.repository";
import { RefreshTokenUserRepository } from "./common/refreshTokenUser.repository";
import { RefreshTokenAdminRepository } from "./common/refreshTokenAdmin.repository";
import { AdminRepository } from "./common/admin.repository";
import { PaymentQrSettingRepository } from "./common/paymentQrSetting.repository";
import { AdminPaymentSystemRepository } from "./common/adminPaymentSystem.repository";
import { AdminRoleRepository } from "./common/adminRole.repository";
import { ProviderConfigRepository } from "./common/providerConfig.repository";
import { UserKYCRequestRepository } from "./common/userKYCRequest.repository";
import { ServiceAttributeRepository } from "./common/serviceAttribute.repository";
import { ServiceAttributeValueRepository } from "./common/serviceAttributeValue.repository";
import { ProviderServiceAttributeRepository } from "./common/providerServiceAttribute.repository";
import { ProviderServiceAttributeValueRepository } from "./common/providerServiceAttributeValue.repository";
import { ReportUserRepository } from "./common/reportUser.repository";
import { WithdrawalRequestRepository } from "./common/withdrawalRequest.repository";
import { UserPaymentSystemRepository } from "./common/userPaymentSystem.repository";
import { BannerRepository } from "./common/banner.repository";
import { FollowRepository } from "./common/follow.repository";
import { BookingComplaintRepository } from "./common/bookingComplaint.repository";
import { BookingComplaintResponseRepository } from "./common/bookingComplaintResponse.repository";
import { HashTagRepository } from "./common/hashTag.repository";
import { InstantCardHashTagRepository } from "./common/instantCardHashTag.repository";
import { InstantCardRepository } from "./common/instantCard.repository";

const bookingCostRepository = new BookingCostRepository();
const bookingHistoryRepository = new BookingHistoryRepository();
const balanceHistoryRepository = new BalanceHistoryRepository();
const providerRepository = new ProviderRepository();
const providerServiceRepository = new ProviderServiceRepository();
const serviceRepository = new ServiceRepository();
const userRepository = new UserRepository();
const refreshTokenUserRepository = new RefreshTokenUserRepository();
const adminRepository = new AdminRepository();
const adminRoleRepository = new AdminRoleRepository();
const refreshTokenAdminRepository = new RefreshTokenAdminRepository();
const adminPaymentSystemRepository = new AdminPaymentSystemRepository();
const feedbackRepository = new FeedbackRepository();
const depositRequestRepository = new DepositRequestRepository();
const balanceSettingRepository = new BalanceSettingRepository();
const postRepository = new PostRepository();
const commentPostRepository = new CommentPostRepository();
const likePostRepository = new LikePostRepository();
const watchedPostRepository = new WatchedPostRepository();
const noticeRepository = new NoticeRepository();
const donationRepository = new DonationRepository();
const voucherRepository = new VoucherRepository();
const voucherRedeemedBookingRepository = new VoucherRedeemedBookingRepository();
const paymentQrSettingRepository = new PaymentQrSettingRepository();
const providerConfigRepository = new ProviderConfigRepository();
const userKYCRequestRepository = new UserKYCRequestRepository();
const serviceAttributeRepository = new ServiceAttributeRepository();
const serviceAttributeValueRepository = new ServiceAttributeValueRepository();
const providerServiceAttributeRepository =
    new ProviderServiceAttributeRepository();
const providerServiceAttributeValueRepository =
    new ProviderServiceAttributeValueRepository();
const reportUserRepository = new ReportUserRepository();
const withdrawalRequestRepository = new WithdrawalRequestRepository();
const userPaymentSystemRepository = new UserPaymentSystemRepository();
const bannerRepository = new BannerRepository();
const followRepository = new FollowRepository();
const bookingComplaintRepository = new BookingComplaintRepository();
const bookingComplaintResponseRepository =
    new BookingComplaintResponseRepository();
const hashTagRepository = new HashTagRepository();
const instantCardHashTagRepository = new InstantCardHashTagRepository();
const instantCardRepository = new InstantCardRepository();
export {
    hashTagRepository,
    instantCardHashTagRepository,
    instantCardRepository,
    bookingCostRepository,
    bookingHistoryRepository,
    balanceHistoryRepository,
    providerRepository,
    providerServiceRepository,
    serviceRepository,
    userRepository,
    adminRoleRepository,
    refreshTokenUserRepository,
    adminRepository,
    adminPaymentSystemRepository,
    refreshTokenAdminRepository,
    feedbackRepository,
    depositRequestRepository,
    balanceSettingRepository,
    postRepository,
    commentPostRepository,
    likePostRepository,
    watchedPostRepository,
    noticeRepository,
    donationRepository,
    voucherRepository,
    voucherRedeemedBookingRepository,
    paymentQrSettingRepository,
    providerConfigRepository,
    userKYCRequestRepository,
    serviceAttributeRepository,
    serviceAttributeValueRepository,
    providerServiceAttributeRepository,
    providerServiceAttributeValueRepository,
    reportUserRepository,
    withdrawalRequestRepository,
    userPaymentSystemRepository,
    bannerRepository,
    followRepository,
    bookingComplaintRepository,
    bookingComplaintResponseRepository,
};
