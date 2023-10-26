import { ErrorService } from "./errors/errorService";

// Crud
import { UserService } from "./api/v1/user.service";
import { TokenService } from "./common/token.service";
import { ScheduleService } from "./common/schedule.service";
import { ImageService } from "./api/image.service";
import { UtilService } from "./common/util.service";
import { FileService } from "./api/file.service";
import { BcryptService } from "./common/bcrypt.service";
import { FirebaseService } from "./common/firebase.service";
import { CryptoService } from "./common/crypto.service";
import { ServiceService } from "./api/v1/service.service";
import { ProviderService } from "./api/v1/provider.service";
import { ProviderServiceService } from "./api/v1/providerService.service";
import { CoinService } from "./api/v1/coin.service";
import { BookingService } from "./api/v1/booking.service";
import { FeedbackService } from "./api/v1/feedback.service";
import { BuyCoinRequestService } from "./api/v1/buyCoinRequest.service";
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
import { WithdrawRequestService } from "./api/v1/withdrawRequest.service";
import { UserPaymentSystemService } from "./api/v1/userPaymentSystem.service";

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
const coinService = new CoinService();
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
const buyCoinRequestService = new BuyCoinRequestService();
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
const withdrawRequestService = new WithdrawRequestService();
const userPaymentSystemService = new UserPaymentSystemService();
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
    // redisService,
    // CRUD
    bookingService,
    coinService,
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
    buyCoinRequestService,
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
    withdrawRequestService,
    userPaymentSystemService,
};
