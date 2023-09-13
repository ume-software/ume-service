import { LoginInAppRequest, RegisterInAppRequest, RenewTokenRequest, LoginSNSRequest } from "@/common/requests";
import { LoginResponse, RenewTokenResponse } from "@/common/responses/auth";
;
import { loginService } from "@/services";

export class AuthService {
  async userLoginInApp(reqLogin: LoginInAppRequest): Promise<LoginResponse> {
    return await loginService.userLoginInApp(reqLogin);
  }

  async userRegisterInApp(
    reqRegister: RegisterInAppRequest
  ): Promise<LoginResponse> {
    return await loginService.userRegisterInApp(reqRegister);
  }

  async renewTokenInApp(
    revokeToken: RenewTokenRequest
  ): Promise<RenewTokenResponse> {
    return await loginService.userRenewTokenInApp(revokeToken);
  }

  async userLoginSns(reqLogin: LoginSNSRequest & { ipv4: string }): Promise<LoginResponse> {

    return await loginService.userloginSNS(reqLogin);
  }

  async adminRegisterAccount(
    reqRegister: RegisterInAppRequest
  ): Promise<LoginResponse> {
    return await loginService.adminRegisterAccount(reqRegister);
  }

  async adminLogin(reqLogin: LoginInAppRequest): Promise<LoginResponse> {
    return await loginService.adminLogin(reqLogin);
  }

  async adminRenewToken(
    revokeToken: RenewTokenRequest
  ): Promise<RenewTokenResponse> {
    return await loginService.adminRenewToken(revokeToken);
  }
}
