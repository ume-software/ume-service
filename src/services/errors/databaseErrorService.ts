import { IErrorResponse } from "../../interfaces";
import { BaseError, IBaseErrorOption } from "./base";
import { ERROR_MESSAGE } from "./errorMessage";
export class DatabaseException extends BaseError {
    constructor(key: string, error: IBaseErrorOption) {
        const { statusCode, codeNumber, type, message } = error;
        super({
            statusCode: statusCode || 500,
            codeNumber,
            type: type || `database_exception_${key}`,
            message,
        });
    }
}
export class DatabaseErrorService {
    recordNotFound(message?: IErrorResponse) {
        if (!message) {
            message = { ...ERROR_MESSAGE.RECORD_NOT_FOUND };
        }
        return new DatabaseException(
            "record_not_found",
            ERROR_MESSAGE.RECORD_NOT_FOUND
        );
    }
    queryFail(message: IErrorResponse) {
        const key = "query_fail";
        return this.resErrWithCode(key, message);
    }
    duplicate(message: IErrorResponse) {
        const key = "duplicate";
        return this.resErrWithCode(key, message);
    }
    errorCustom(message: IErrorResponse) {
        const key = "error_custom";
        return this.resErrWithCode(key, message);
    }
    invalidScope(message: IErrorResponse) {
        const key = "invalid_scope";
        return this.resErrWithCode(key, message);
    }

    private resErrWithCode(key: string, errorResonse: IErrorResponse) {
        return new DatabaseException(key, errorResonse);
    }
}
