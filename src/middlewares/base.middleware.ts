import { Request, Response } from '@/controllers/base/base.controller'
import { errorService } from '@/services'
import * as express from 'express'

export class BaseMiddleware {
    onError(res: Response, error: any) {
        if (!error.options) {
            const err = errorService.router.somethingWentWrong()
            res.status(err.options.statusCode).json(err.options)
        } else {
            res.status(error.options.statusCode).json(error.options)
        }
    }
    run(option?: any) {
        return (req: Request, res: Response, next: express.NextFunction) => this.use
            .bind(this)(req, res, next, option)
            .catch((error: any) => {
                if (!error.options) {
                    console.log("UNKNOW ERROR", error)
                    error.options = errorService.router.somethingWentWrong().options
                }
               
                this.onError(res, error)
            })
    }
    async use(_req: Request, _res: Response, next: express.NextFunction, _option?: any) {
        next()
    }
}