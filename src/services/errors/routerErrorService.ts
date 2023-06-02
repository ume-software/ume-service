

import { IErrorResponse } from '@/interfaces'
import { BaseError, IBaseErrorOption } from './base'
import { ERROR_MESSAGE } from './errorMessage'
class RouterException extends BaseError {


    constructor(key: string, error: IBaseErrorOption) {
        const { statusCode, codeNumber, type, message } = error
        super({
            statusCode: statusCode || 500,
            codeNumber,
            type: type || `router_exception_${key}`,
            message
        })
    }
}

export class RouterErrorService {
    somethingWentWrong() {
        return new RouterException('something_went_wrong', ERROR_MESSAGE.SORRY_SOMETHING_WENT_WRONG)
    }
    theAPINotSupported() {
        return new RouterException('api_not_supported', ERROR_MESSAGE.THE_API_NOT_SUPPORTED)
    }
    badRequest() {
        return new RouterException('bad_request', ERROR_MESSAGE.BAD_REQUEST)
    }
    errorCustom(message: IErrorResponse) {
        const key = "error_custom";

        return this.resErrWithCode(key, message)
    }
    requestDataInvalid(message: IErrorResponse) {
        const key = "data_invalid"
        return this.resErrWithCode(key, message)
    }

    private resErrWithCode(key: string, errorResonse: IErrorResponse) {
        return new RouterException(key, errorResonse);
    }
}
