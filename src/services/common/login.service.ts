import { EAccountType } from "@/enums/accountType.enum";
import { IAccessToken } from "@/interfaces/auth/accessToken.interface";
import {
    adminRepository,
    refreshTokenAdminRepository,
    refreshTokenUserRepository,
    userRepository,
} from "@/repositories";
import {
    bcryptService,
    errorService,
    firebaseService,
    googleService,
    tokenService,
} from "..";
import { ERROR_MESSAGE } from "../errors/errorMessage";
import axios from "axios";
import { LoginType, User } from "@prisma/client";
import {
    RegisterInAppRequest,
    LoginInAppRequest,
    RenewTokenRequest,
    LoginSNSRequest,
} from "@/common/requests";
import {
    UserLoginResponse,
    RenewTokenResponse,
    AdminLoginResponse,
} from "@/common/responses/auth";

export class LoginService {
    constructor() {}

    async userRegisterInApp(
        registerRequest: RegisterInAppRequest
    ): Promise<UserLoginResponse> {
        const reqLogin: LoginInAppRequest = {
            ...registerRequest,
        };
        const existedUser = await userRepository.findByUsername(
            registerRequest.username
        );

        if (existedUser) {
            throw errorService.error(ERROR_MESSAGE.USERNAME_ALREADY_REGISTERED);
        }
        reqLogin.password = await bcryptService.hashData(
            registerRequest.password
        );
        await userRepository.create(reqLogin);

        return await this.userLoginInApp({
            ...reqLogin,
            password: registerRequest.password,
        });
    }

    async userLoginInApp(
        reqLogin: LoginInAppRequest
    ): Promise<UserLoginResponse> {
        const { username, password } = reqLogin;
        if (!username || !password) {
            throw errorService.badRequest();
        }
        let user = await userRepository.findOne({
            where: {
                username,
            },
        });
        if (!user) {
            throw errorService.error(ERROR_MESSAGE.USERNAME_DOES_NOT_EXIST);
        }
        if (user.loginType != LoginType.INAPP) {
            switch (user.loginType) {
                case LoginType.GOOGLE: {
                    throw errorService.error(
                        ERROR_MESSAGE.THIS_ACCOUNT_IS_GOOGLE
                    );
                }
                case LoginType.APPLE: {
                    throw errorService.error(
                        ERROR_MESSAGE.THIS_ACCOUNT_IS_APPLE
                    );
                }
                case LoginType.KAKAO: {
                    throw errorService.error(
                        ERROR_MESSAGE.THIS_ACCOUNT_IS_KAKAOTALK
                    );
                }
            }
        }

        if (
            !(await bcryptService.compareDataWithHash(
                password,
                user.password!!
            ))
        ) {
            throw errorService.error(
                ERROR_MESSAGE.PASSWORD_OR_USERNAME_INCORRECT
            );
        }
        const accessTokenPayload: IAccessToken = {
            id: user.id,
            loginType: user.loginType,
            type: EAccountType.USER,
        };

        return {
            accessToken: await this.generateAccessToken(accessTokenPayload),
            refreshToken: await this.generateRefreshTokenUser(
                accessTokenPayload.id
            ),
            user,
        };
    }

    async userRenewTokenInApp(
        revokeToken: RenewTokenRequest
    ): Promise<RenewTokenResponse> {
        const refreshToken =
            await refreshTokenUserRepository.findOneByRefreshToken(
                revokeToken.refreshToken
            );
        if (!refreshToken) {
            throw errorService.badToken();
        }
        const { userId } = refreshToken;
        const user = await userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw errorService.badToken();
        }
        const accessTokenPayload: IAccessToken = {
            id: user.id,
            loginType: user.loginType,
            type: EAccountType.USER,
        };
        const accessToken = await this.generateAccessToken(accessTokenPayload);

        return {
            accessToken,
        };
    }

    async generateAccessToken(
        accessTokenPayload: IAccessToken
    ): Promise<string> {
        return await tokenService.generateToken(accessTokenPayload);
    }

    async generateRefreshTokenUser(userId: string): Promise<string> {
        const refreshTokenUser =
            await refreshTokenUserRepository.findOneByUserId(userId);
        if (refreshTokenUser) {
            try {
                tokenService.decodeToken(refreshTokenUser.refreshToken!!);
                return refreshTokenUser.refreshToken!!;
            } catch (e) {
                const refreshToken = await tokenService.generateToken(
                    {},
                    { exp: "1 years" }
                );
                const newRefreshTokenAdmin =
                    await refreshTokenUserRepository.updateByUserId(userId, {
                        refreshToken,
                    });
                return newRefreshTokenAdmin.refreshToken!!;
            }
        }
        const refreshToken = await tokenService.generateToken(
            {},
            { exp: "1 years" }
        );

        const newRefreshTokenUser = await refreshTokenUserRepository.create({
            user: {
                connect: {
                    id: userId,
                },
            },
            refreshToken,
        });
        return newRefreshTokenUser.refreshToken!!;
    }

    async userLoginSNS(loginSnsRequest: LoginSNSRequest & { ipv4: string }) {
        const { loginType, token, ipv4 } = loginSnsRequest;
        let isNewSignup = false;
        let url: string;
        let response: any = {};
        let dataFromSocial: any = {};
        let username = null;
        let name = null;
        let avatarUrl = null;
        let email = null;
        let dob = null;
        let phone = null;
        switch (loginType) {
            case LoginType.GOOGLE:
                const payload = await googleService.getUserInfoWithAccessToken(
                    token
                );
                email = payload.email;
                username = email;
                avatarUrl = payload.picture;
                name = payload.name;
                break;
            case LoginType.FACEBOOK:
                url = `https://graph.facebook.com/me?access_token=${token}&fields=id,name,picture.width(300).height(300)`;
                response = await axios.get(url);
                dataFromSocial = response.data;
                username = dataFromSocial.id;
                name = dataFromSocial.name;
                avatarUrl = dataFromSocial.picture.data.url;
                break;
            case LoginType.APPLE:
                url = "com.chu.appname";
                username = dataFromSocial.email;
                email = dataFromSocial.email;
                break;
            case LoginType.PHONE:
                dataFromSocial = await firebaseService.verifyIdToken(token);
                username = dataFromSocial.phone_number;
                phone = dataFromSocial.phone_number;
                break;

            default:
                throw errorService.error(
                    ERROR_MESSAGE.LOGIN_METHOD_NOT_SUPPORTED
                );
                break;
        }
        let user: User | null = await userRepository.findOne({
            where: {
                loginType,
                username,
            },
        });
        if (!user) {
            const body: any = {
                name,
                username,
                email,
                avatarUrl,
                loginType,
                dob,
                phone,
                ipv4,
            };
            user = await userRepository.create(body);
            isNewSignup = true;
        }

        const accessTokenPayload: IAccessToken = {
            id: user.id,
            loginType: user.loginType,
            type: EAccountType.USER,
        };

        return {
            accessToken: await this.generateAccessToken(accessTokenPayload),
            refreshToken: await this.generateRefreshTokenUser(
                accessTokenPayload.id
            ),
            user,
            isNewSignup,
        };
    }

    async adminRegisterAccount(
        registerRequest: RegisterInAppRequest
    ): Promise<AdminLoginResponse> {
        const reqLogin: LoginInAppRequest = {
            ...registerRequest,
        };
        const existedAdmin = await adminRepository.findByUsername(
            registerRequest.username
        );

        if (existedAdmin) {
            throw errorService.error(ERROR_MESSAGE.USERNAME_ALREADY_REGISTERED);
        }
        reqLogin.password = await bcryptService.hashData(
            registerRequest.password
        );
        await adminRepository.create(reqLogin);

        return await this.adminLogin({
            ...reqLogin,
            password: registerRequest.password,
        });
    }

    async adminLogin(reqLogin: LoginInAppRequest): Promise<AdminLoginResponse> {
        const { username, password } = reqLogin;
        if (!username || !password) {
            throw errorService.badRequest();
        }
        let admin = await adminRepository.findOne({
            where: {
                username,
            },
            include: {
                adminRoles: true,
            },
        });
        if (!admin) {
            throw errorService.error(ERROR_MESSAGE.USERNAME_DOES_NOT_EXIST);
        }

        if (
            !(await bcryptService.compareDataWithHash(
                password,
                admin.password!!
            ))
        ) {
            throw errorService.error(
                ERROR_MESSAGE.PASSWORD_OR_USERNAME_INCORRECT
            );
        }
        const accessTokenPayload: IAccessToken = {
            id: admin.id,
            loginType: LoginType.INAPP,
            type: EAccountType.ADMIN,
        };
        return {
            accessToken: await this.generateAccessToken(accessTokenPayload),
            refreshToken: await this.generateRefreshTokenAdmin(
                accessTokenPayload.id
            ),
            admin,
        };
    }

    async generateRefreshTokenAdmin(adminId: string): Promise<string> {
        const refreshTokenAdmin =
            await refreshTokenAdminRepository.findOneByAdminId(adminId);
        if (refreshTokenAdmin) {
            try {
                tokenService.decodeToken(refreshTokenAdmin.refreshToken!!);
                return refreshTokenAdmin.refreshToken!!;
            } catch (e) {
                const refreshToken = await tokenService.generateToken(
                    {},
                    { exp: "1 years" }
                );
                const newRefreshTokenAdmin =
                    await refreshTokenAdminRepository.updateByAdminId(adminId, {
                        refreshToken,
                    });
                return newRefreshTokenAdmin.refreshToken!!;
            }
        }
        const refreshToken = await tokenService.generateToken(
            {},
            { exp: "1 years" }
        );

        const newRefreshTokenAdmin = await refreshTokenAdminRepository.create({
            admin: {
                connect: {
                    id: adminId,
                },
            },
            refreshToken,
        });
        return newRefreshTokenAdmin.refreshToken!!;
    }

    async adminRenewToken(
        revokeToken: RenewTokenRequest
    ): Promise<RenewTokenResponse> {
        const refreshToken =
            await refreshTokenAdminRepository.findOneByRefreshToken(
                revokeToken.refreshToken
            );
        if (!refreshToken) {
            throw errorService.badToken();
        }
        const { adminId } = refreshToken;
        const admin = await adminRepository.findOne({ where: { id: adminId } });
        if (!admin) {
            throw errorService.badToken();
        }
        const accessTokenPayload: IAccessToken = {
            id: admin.id,
            loginType: LoginType.INAPP,
            type: EAccountType.ADMIN,
        };
        const accessToken = await this.generateAccessToken(accessTokenPayload);

        return {
            accessToken,
        };
    }
}
