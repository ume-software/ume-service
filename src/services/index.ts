import { ErrorService } from "./errorService";

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
import { SkillService } from "./api/v1/skill.service";
import { ProviderService } from "./api/v1/provider.service";
import { ProviderSkillService } from "./api/v1/providerSkill.service";
import { CoinService } from "./api/v1/coin.service";
import { BookingService } from "./api/v1/booking.service";
import { FeedbackService } from "./api/v1/feedback.service";
import { BuyCoinRequestService } from "./api/v1/buyCoinRequest.service";
import { IdentitySystemService } from "./system/identitySystem.service";
import { PostService } from "./api/v1/post.service";
import { CommentPostService } from "./api/v1/commentPost.service";
import { LikePostService } from "./api/v1/likePost.service";
import { WatchedPostService } from "./api/v1/watchedPost.service";

const fileService = new FileService();
const imageService = new ImageService();
const scheduleService = new ScheduleService();
const tokenService = new TokenService();
const utilService = new UtilService();
const bcryptService = new BcryptService();
const cryptoService = new CryptoService();
const errorService = new ErrorService();
const firebaseService = new FirebaseService();

//=============
const bookingService = new BookingService();
const coinService = new CoinService();
const providerService = new ProviderService();
const providerSkillService = new ProviderSkillService();
const skillService = new SkillService();
const userService = new UserService();
const feedbackService = new FeedbackService();
const buyCoinRequestService = new BuyCoinRequestService();
const identitySystemService = new IdentitySystemService();
const postService = new PostService();
const commentPostService = new CommentPostService();
const likePostService = new LikePostService();
const watchedPostService = new WatchedPostService();
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
    // CRUD
    bookingService,
    coinService,
    providerService,
    providerSkillService,
    userService,
    skillService,
    feedbackService,
    buyCoinRequestService,
    identitySystemService,
    postService,
    commentPostService,
    likePostService,
    watchedPostService
};
