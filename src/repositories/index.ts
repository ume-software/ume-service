import { BookingCostRepository } from "./common/bookingCost.repository";
import { BookingHistoryRepository } from "./common/bookingHistory.repository";
import { CoinHistoryRepository } from "./common/coinHistory.repository";
import { ProviderRepository } from "./common/provider.repository";
import { ProviderServiceRepository } from "./common/providerService.repository";
import { ServiceRepository } from "./common/service.repository";
import { UserRepository } from "./common/user.repository";
import { FeedbackRepository } from "./common/feedback.repository";
import { BuyCoinRequestRepository } from "./common/buyCoinRequest.repository";
import { CoinSettingRepository } from "./common/coinSetting.repository";
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
import { ProvinceRepository } from "./common/province.repository";
import { DistrictRepository } from "./common/district.repository";
import { CommuneRepository } from "./common/commune.repository";
import { ProviderConfigRepository } from "./common/providerConfig.repository";
import { UserKYCRequestRepository } from "./common/userKYCRequest.repository";
import { ServiceAttributeRepository } from "./common/serviceAttribute.repository";
import { ServiceAttributeValueRepository } from "./common/serviceAttributeValue.repository";
import { ProviderServiceAttributeRepository } from "./common/providerServiceAttribute.repository";
import { ProviderServiceAttributeValueRepository } from "./common/providerServiceAttributeValue.repository";
import { ReportUserRepository } from "./common/reportUser.repository";
import { WithdrawRequestRepository } from "./common/withdrawRequest.repository";
import { UserPaymentSystemRepository } from "./common/userPaymentSystem.repository";
import { BannerRepository } from "./common/banner.repository";

const bookingCostRepository = new BookingCostRepository();
const bookingHistoryRepository = new BookingHistoryRepository();
const coinHistoryRepository = new CoinHistoryRepository();
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
const buyCoinRequestRepository = new BuyCoinRequestRepository();
const coinSettingRepository = new CoinSettingRepository();
const postRepository = new PostRepository();
const commentPostRepository = new CommentPostRepository();
const likePostRepository = new LikePostRepository();
const watchedPostRepository = new WatchedPostRepository();
const noticeRepository = new NoticeRepository();
const donationRepository = new DonationRepository();
const voucherRepository = new VoucherRepository();
const voucherRedeemedBookingRepository = new VoucherRedeemedBookingRepository();
const paymentQrSettingRepository = new PaymentQrSettingRepository();
const provinceRepository = new ProvinceRepository();
const districtRepository = new DistrictRepository();
const communeRepository = new CommuneRepository();
const providerConfigRepository = new ProviderConfigRepository();
const userKYCRequestRepository = new UserKYCRequestRepository();
const serviceAttributeRepository = new ServiceAttributeRepository();
const serviceAttributeValueRepository = new ServiceAttributeValueRepository();
const providerServiceAttributeRepository =
    new ProviderServiceAttributeRepository();
const providerServiceAttributeValueRepository =
    new ProviderServiceAttributeValueRepository();
const reportUserRepository = new ReportUserRepository();
const withdrawRequestRepository = new WithdrawRequestRepository();
const userPaymentSystemRepository = new UserPaymentSystemRepository();
const bannerRepository = new BannerRepository();
export {
    bookingCostRepository,
    bookingHistoryRepository,
    coinHistoryRepository,
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
    buyCoinRequestRepository,
    coinSettingRepository,
    postRepository,
    commentPostRepository,
    likePostRepository,
    watchedPostRepository,
    noticeRepository,
    donationRepository,
    voucherRepository,
    voucherRedeemedBookingRepository,
    paymentQrSettingRepository,
    provinceRepository,
    districtRepository,
    communeRepository,
    providerConfigRepository,
    userKYCRequestRepository,
    serviceAttributeRepository,
    serviceAttributeValueRepository,
    providerServiceAttributeRepository,
    providerServiceAttributeValueRepository,
    reportUserRepository,
    withdrawRequestRepository,
    userPaymentSystemRepository,
    bannerRepository,
};
