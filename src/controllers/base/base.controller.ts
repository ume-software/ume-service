
import * as express from 'express';
import { IHLErrorResponse } from '../../interfaces';
import { cryptoService, errorService } from '../../services';
import * as _ from 'lodash';
import { IAccessToken } from '@/interfaces/auth/accessToken.interface';
import { accountTypeMiddleware, authMiddleware, authOrUnAuthMiddleware } from '@/middlewares';
import { ICrudOptionPrisma } from '@/services/base/basePrisma.service';
import { config } from '@/configs';
import { UNLIMITED } from '@/middlewares/queryPrisma.middleware';
import { EAccountType } from '@/enums/accountType.enum';


export interface Request extends express.Request {
    ipv4?: string,
    queryInfoPrisma?: ICrudOptionPrisma,
    tokenInfo?: IAccessToken,
    [x: string]: any
}
export interface Response extends express.Response {
    req: Request;
    [x: string]: any
}
export interface IValidateSchema {
    type?: string | string[],
    properties?: IValidateSchemaProperties
    additionalProperties?: boolean
    required?: string[]
    uniqueItems?: boolean
    minItems?: number
    items?: IValidateSchema
    [x: string]: any
}
export interface IValidateSchemaProperties {
    [x: string]: IValidateSchema
}
export const pathPublicKey = config.server.public_key
export class BaseController {
    constructor() {
        this.router = express.Router();
    }
    path: string | undefined;
    router: express.Router
    onError(res: Response, error: any) {
        // Raven.captureException(error);
        if (!error.options) {
            console.log("UNKNOW ERROR", error)
            const err = errorService.router.somethingWentWrong()
            res.status(err.options.code).json(err.options)
        } else {
            res.status(error.options.code).json(error.options)
        }
    }
    onEncryptError(res: Response, error: any) {
        // Raven.captureException(error);

        if (!error.options) {
            console.log("UNKNOW ERROR", error)
            const err = errorService.router.somethingWentWrong()
            res.status(err.options.code).json({
                data: cryptoService.encryptStringWithRsaPublicKey(error.options, pathPublicKey)
            })
        } else {
            res.status(error.options.code).json({
                data: cryptoService.encryptStringWithRsaPublicKey(error.options, pathPublicKey)
            })
        }
    }

    onSuccess(res: Response, object: any = {}, extras: any = {}) {
        object = object || {}
        if (Object.keys(object).length === 0) {
            res.status(200).json({
                code: 200
            }).end()
        } else {
            res.status(200).json({
                code: 200,
                results: Object.assign({
                    object
                }, extras)
            }).end()
        }
    }


    onEncryptSuccess(res: Response, object: any = {}, extras: any = {}) {
        object = object || {};
        let data = {}
        if (Object.keys(object).length === 0) {
            data = {
                code: 200
            }
        } else {
            data = {
                code: 200,
                results: Object.assign({
                    object
                }, extras)
            }
        }

        res.status(200).json(
            {
                data: cryptoService.encryptStringWithRsaPublicKey(data, pathPublicKey)
            }
        ).end()
    }

    onSuccessAsList(res: Response, objects: any = [], extras: any = {}) {
        if (objects.toJSON) {
            objects = objects.toJSON()
        }
        const queryPage = res.req.query['page'];
        const queryLimit = res.req.query['limit'];
        const page = typeof queryPage == "string" ? Number.parseInt(queryPage) : 1
        res.json({
            code: 200,
            results: Object.assign({
                objects
            }, extras),


            pagination: {
                'current_page': page,
                'next_page': page + 1,
                'prev_page': page - 1,
                'limit': queryLimit == UNLIMITED ? UNLIMITED : typeof queryLimit == "string" ? Number.parseInt(queryLimit) : config.database.defaultPageSize
            }
        })
    }

    onEncryptSuccessAsList(res: Response, objects: any = [], extras: any = {}) {
        if (objects.toJSON) {
            objects = objects.toJSON()
        }
        const queryPage = res.req.query['page'];
        const queryLimit = res.req.query['limit'];
        const page = typeof queryPage == "string" ? Number.parseInt(queryPage) : 1;
        const data = {
            code: 200,
            results: Object.assign({
                objects
            }, extras),


            pagination: {
                'current_page': page,
                'next_page': page + 1,
                'prev_page': page - 1,
                'limit': queryLimit == UNLIMITED ? UNLIMITED : typeof queryLimit == "string" ? Number.parseInt(queryLimit) : config.database.defaultPageSize
            }
        }
        res.json({
            data: cryptoService.encryptStringWithRsaPublicKey(data, pathPublicKey)
        })
    }

    route(func: (req: Request, rep: Response) => Promise<any>) {
        return (req: Request, res: Response) => func
            .bind(this)(req, res)
            .catch((error: any) => {
                console.log('error ===> ', error.options)
                if (!error.options) {
                    console.log("UNKNOW ERROR", error)
                    error.options = errorService.router.somethingWentWrong().options
                }
                try {
                    const hl = req.query['hl']
                    const message: IHLErrorResponse = error.options.message
                    const translateMessage = message[`${hl}`] || message.en
                    if (typeof translateMessage === 'string') {

                        error.options.message = translateMessage

                        if (translateMessage == "") {
                            error.options.message = message.en
                        }

                    }
                } catch (e) {

                }
                this.onError(res, error)
            })
    }

    routeEncrypt(func: (req: Request, rep: Response) => Promise<any>) {
        return (req: Request, res: Response) => func
            .bind(this)(req, res)
            .catch((error: any) => {
                console.log('error ===> ', error.options)
                if (!error.options) {
                    console.log("UNKNOW ERROR", error)
                    error.options = errorService.router.somethingWentWrong().options
                }
                try {
                    const hl = req.query['hl']
                    const message: IHLErrorResponse = error.options.message
                    const translateMessage = message[`${hl}`] || message.en
                    if (typeof translateMessage === 'string') {

                        error.options.message = translateMessage

                        if (translateMessage == "") {
                            error.options.message = message.en
                        }

                    }
                } catch (e) {

                }
                this.onError(res, error)
            })
    }

    authMiddlewares(): any[] {
        return [authMiddleware.run()];
    }

    authOrUnAuthMiddlewares(): any[] {
        return [authOrUnAuthMiddleware.run()];
    }

    accountTypeMiddlewares(option: EAccountType): any[] {
        return [accountTypeMiddleware.run(option)]
    }
}