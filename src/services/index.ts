
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
const skillService = new SkillService();
const userService = new UserService();

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
  userService,
  skillService


};
