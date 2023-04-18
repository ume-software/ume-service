
import { ErrorService } from "./errorService";


// Crud
import { UserService } from "./api/v1/user.service";
import { TokenService } from "./common/token.service";
import { ScheduleService } from "./common/schedule.service";
import { ImageService } from "./api/image.service";
import { UtilService } from "./common/utilService";
import { FileService } from "./api/file.service";
import { BcryptService } from "./common/bcrypt.service";
import { FirebaseService } from "./common/firebase.service";

const fileService = new FileService();
const imageService = new ImageService();
const scheduleService = new ScheduleService();
const tokenService = new TokenService();
const utilService = new UtilService();
const bcryptService = new BcryptService();
const errorService = new ErrorService();
const firebaseService = new FirebaseService();
const userService = new UserService();

export {
  scheduleService,
  errorService,
  utilService,
  tokenService,
  bcryptService,
  imageService,
  fileService,
  firebaseService,
  // CRUD
  userService


};
