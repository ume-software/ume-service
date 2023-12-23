import { ErrorService } from "./errors/errorService";

// Crud
import { UserService } from "./api/v1/user.service";
import { TokenService } from "./common/token.service";
import { ScheduleService } from "./common/schedule.service";
import { ImageService } from "./api/v1/image.service";
import { UtilService } from "./common/util.service";
import { FileService } from "./api/v1/file.service";
import { BcryptService } from "./common/bcrypt.service";
import { FirebaseService } from "./common/firebase.service";
import { CryptoService } from "./common/crypto.service";
import { ServiceService } from "./api/v1/service.service";
import { ProviderService } from "./api/v1/provider.service";
import { ProviderServiceService } from "./api/v1/providerService.service";
import { BalanceService } from "./api/v1/balance.service";
import { BookingService } from "./api/v1/booking.service";
import { FeedbackService } from "./api/v1/feedback.service";
import { DepositRequestService } from "./api/v1/depositRequest.service";
import { PostService } from "./api/v1/post.service";
import { CommentPostService } from "./api/v1/commentPost.service";
import { LikePostService } from "./api/v1/likePost.service";
import { WatchedPostService } from "./api/v1/watchedPost.service";
import { NoticeService } from "./api/v1/notice.service";
import { DonationService } from "./api/v1/donation.service";
import { VoucherService } from "./api/v1/voucher.service";
import { VoucherRedeemedBookingService } from "./api/v1/voucherRedeemedBooking.service";
// import { RedisService } from "./common/redis.service";
import { AdminService } from "./api/v1/admin.service";
import { AdminPaymentSystemService } from "./api/v1/adminPaymentSystem.service";
import { AdminRoleService } from "./api/v1/adminRole.service";
import { AuthService } from "./api/v1/auth.service";
import { PaymentQrSettingService } from "./api/v1/paymentQrSetting.service";
import { QrPaymentService } from "./api/v1/qrPayment.service";
import { GoogleService } from "./common/google.service";
import { LoginService } from "./common/login.service";
import { VietnamAddressService } from "./api/v1/vietnamAddress.service";
import { VNPayService } from "./api/v1/vnpay.service";
import { MomoService } from "./api/v1/momo.service";
import { ServiceAttributeService } from "./api/v1/serviceAttribute.service";
import { WithdrawalRequestService } from "./api/v1/withdrawalRequest.service";
import { UserPaymentSystemService } from "./api/v1/userPaymentSystem.service";
import { BannerService } from "./api/v1/banner.service";
import { ReportUserService } from "./api/v1/reportUser.service";
import { StatisticService } from "./api/v1/statistic.service";
import { FollowService } from "./api/v1/follow.service";
import { NodemailerService } from "./common/nodemailer.service";
import { BookingComplaintService } from "./api/v1/bookingComplaint.service";
import { BookingComplaintResponseService } from "./api/v1/bookingComplaintResponse.service";
import { InstantCardService } from "./api/v1/instantCard.service";
import { HashTagService } from "./api/v1/hashTag.service";

const fileService = new FileService();
const imageService = new ImageService();
const scheduleService = new ScheduleService();
const tokenService = new TokenService();
const utilService = new UtilService();
const bcryptService = new BcryptService();
const cryptoService = new CryptoService();
const errorService = new ErrorService();
const firebaseService = new FirebaseService();
const loginService = new LoginService();
const googleService = new GoogleService();
// const redisService = new RedisService();
//=============
const bookingService = new BookingService();
const balanceService = new BalanceService();
const providerService = new ProviderService();
const providerServiceService = new ProviderServiceService();
const serviceService = new ServiceService();
const userService = new UserService();
const adminService = new AdminService();
const adminPaymentSystemService = new AdminPaymentSystemService();
const adminRole = new AdminRoleService();
const authService = new AuthService();
const paymentQrSettingService = new PaymentQrSettingService();
const qrPaymentService = new QrPaymentService();
const feedbackService = new FeedbackService();
const depositRequestService = new DepositRequestService();
const postService = new PostService();
const commentPostService = new CommentPostService();
const likePostService = new LikePostService();
const watchedPostService = new WatchedPostService();
const noticeService = new NoticeService();
const voucherService = new VoucherService();
const voucherRedeemedBookingService = new VoucherRedeemedBookingService();
const vietnamAddressService = new VietnamAddressService();
const donationService = new DonationService();
const vnpayService = new VNPayService();
const momoService = new MomoService();
const serviceAttributeService = new ServiceAttributeService();
const withdrawalRequestService = new WithdrawalRequestService();
const userPaymentSystemService = new UserPaymentSystemService();
const bannerService = new BannerService();
const reportUserService = new ReportUserService();
const statisticService = new StatisticService();
const followService = new FollowService();
const nodemailerService = new NodemailerService();
const bookingComplaintService = new BookingComplaintService();
const bookingComplaintResponseService = new BookingComplaintResponseService();
const instantCardService = new InstantCardService();
const hashTagService = new HashTagService();
export {
    scheduleService,
    errorService,
    utilService,
    tokenService,
    bcryptService,
    cryptoService,
    imageService,
    fileService,
    firebaseService,
    loginService,
    googleService,
    nodemailerService,
    // redisService,
    // CRUD
    bookingService,
    balanceService,
    providerService,
    providerServiceService,
    userService,
    adminService,
    adminPaymentSystemService,
    adminRole,
    authService,
    paymentQrSettingService,
    qrPaymentService,
    serviceService,
    feedbackService,
    depositRequestService,
    postService,
    commentPostService,
    likePostService,
    watchedPostService,
    noticeService,
    voucherService,
    voucherRedeemedBookingService,
    vietnamAddressService,
    donationService,
    vnpayService,
    momoService,
    serviceAttributeService,
    withdrawalRequestService,
    userPaymentSystemService,
    bannerService,
    reportUserService,
    statisticService,
    followService,
    bookingComplaintService,
    bookingComplaintResponseService,
    instantCardService,
    hashTagService
};
