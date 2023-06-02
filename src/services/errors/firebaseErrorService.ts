import { BaseError, IBaseErrorOption } from './base'
class FirebaseException extends BaseError {
    constructor(key: string, error: IBaseErrorOption) {
        const { statusCode, codeNumber, type, message } = error
        super({
          statusCode: statusCode || 403,
          codeNumber,
          type: type || `firebase_exception_${key}`,
          message
        })
      }
}
export class FirebaseErrorService {
    cannotCreateToken(error: IBaseErrorOption) {
        return new FirebaseException('create_token', error)
    }
    cannotDecodeToken(error: IBaseErrorOption) {
        return new FirebaseException('decode_token', error)
    }
}
