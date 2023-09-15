import {
    LoginInAppRequest,
    RegisterInAppRequest,
    RenewTokenRequest,
    LoginSNSRequest,
} from "@/common/requests";
import {
    UserLoginResponse,
    RenewTokenResponse,
    AdminLoginResponse,
} from "@/common/responses/auth";
import { loginService } from "@/services";

export class AuthService {
    async userLoginInApp(
        reqLogin: LoginInAppRequest
    ): Promise<UserLoginResponse> {
        return await loginService.userLoginInApp(reqLogin);
    }

    async userRegisterInApp(
        reqRegister: RegisterInAppRequest
    ): Promise<UserLoginResponse> {
        return await loginService.userRegisterInApp(reqRegister);
    }

    async renewTokenInApp(
        revokeToken: RenewTokenRequest
    ): Promise<RenewTokenResponse> {
        return await loginService.userRenewTokenInApp(revokeToken);
    }

    async userLoginSns(
        reqLogin: LoginSNSRequest & { ipv4: string }
    ): Promise<UserLoginResponse> {
        return await loginService.userLoginSNS(reqLogin);
    }

    async adminRegisterAccount(
        reqRegister: RegisterInAppRequest
    ): Promise<AdminLoginResponse> {
        return await loginService.adminRegisterAccount(reqRegister);
    }

    async adminLogin(reqLogin: LoginInAppRequest): Promise<AdminLoginResponse> {
        return await loginService.adminLogin(reqLogin);
    }

    async adminRenewToken(
        revokeToken: RenewTokenRequest
    ): Promise<RenewTokenResponse> {
        return await loginService.adminRenewToken(revokeToken);
    }
}
