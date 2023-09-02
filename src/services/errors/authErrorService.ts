import { IErrorResponse } from "@/interfaces";
import { BaseError, IBaseErrorOption } from "./base";
import { ERROR_MESSAGE } from "./errorMessage";
class AuthException extends BaseError {
    constructor(key: string, error: IBaseErrorOption) {
        const { statusCode, codeNumber, type, message } = error;
        super({
            statusCode: statusCode || 401,
            codeNumber,
            type: type || `auth_exception_${key}`,
            message,
        });
    }
}
export class AuthErrorService {
    unauthorized() {
        return new AuthException("unauthorized", ERROR_MESSAGE.UNAUTHORIZED);
    }
    permissionDeny(error?: IErrorResponse) {
        if (!error) {
            return new AuthException(
                "permission_deny",
                ERROR_MESSAGE.YOU_NOT_PERMISSIONS
            );
        }
        return new AuthException("permission_deny", error);
    }
    badToken() {
        return new AuthException("bad_token", ERROR_MESSAGE.BAD_TOKEN);
    }
    tokenExpired() {
        return new AuthException("token_expired", ERROR_MESSAGE.TOKEN_EXPIRED);
    }

    errorCustom(error: IErrorResponse) {
        const key = "error_custom";
        return this.resErrWithCode(key, error);
    }
    private resErrWithCode(key: string, errorResonse: IErrorResponse) {
        return new AuthException(key, errorResonse);
    }
}
