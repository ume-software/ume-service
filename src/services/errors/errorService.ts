import { IErrorResponse } from "@/interfaces";
import { BaseError, IBaseErrorOption } from "./base";
import { ERROR_MESSAGE } from "./errorMessage";
class ErrorResponse extends BaseError {
    constructor(error: IBaseErrorOption) {
        const { statusCode, codeNumber, type, message } = error;
        super({
            statusCode: statusCode || 500,
            codeNumber,
            type,
            message,
        });
    }
}

export class ErrorService {
    unauthorized() {
        return new ErrorResponse(ERROR_MESSAGE.UNAUTHORIZED);
    }
    badToken() {
        return new ErrorResponse(ERROR_MESSAGE.BAD_TOKEN);
    }
    permissionDeny() {
        return new ErrorResponse(ERROR_MESSAGE.YOU_NOT_PERMISSIONS);
    }
    somethingWentWrong() {
        return new ErrorResponse(ERROR_MESSAGE.SORRY_SOMETHING_WENT_WRONG);
    }
    theAPINotSupported() {
        return new ErrorResponse(ERROR_MESSAGE.THE_API_NOT_SUPPORTED);
    }
    recordNotFound() {
        return new ErrorResponse(ERROR_MESSAGE.RECORD_NOT_FOUND);
    }
    badRequest() {
        return new ErrorResponse(ERROR_MESSAGE.BAD_REQUEST);
    }
    error(errorResponse: IErrorResponse) {
        return new ErrorResponse(errorResponse);
    }
}
