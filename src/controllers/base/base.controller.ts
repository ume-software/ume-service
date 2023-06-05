import * as express from "express";
import { cryptoService, errorService } from "../../services";
import * as _ from "lodash";
import { IAccessToken } from "@/interfaces/auth/accessToken.interface";
import {
  accountTypeMiddleware,
  authMiddleware,
  authOrUnAuthMiddleware,
  systemMiddleware,
} from "@/middlewares";
import { ICrudOptionPrisma } from "@/services/base/basePrisma.service";
import { config } from "@/configs";
import { UNLIMITED } from "@/middlewares/queryPrisma.middleware";
import { EAccountType } from "@/enums/accountType.enum";
import { SOCKET_EXPRESS, ServerSocket } from "@/services/socketIO/socketIO.service";

export interface Request extends express.Request {
  ipv4?: string;
  queryInfoPrisma?: ICrudOptionPrisma;
  tokenInfo?: IAccessToken;
  [x: string]: any;
}
export interface Response extends express.Response {
  req: Request;
  [x: string]: any;
}
export interface IValidateSchema {
  type?: string | string[];
  properties?: IValidateSchemaProperties;
  additionalProperties?: boolean;
  required?: string[];
  uniqueItems?: boolean;
  minItems?: number;
  items?: IValidateSchema;
  [x: string]: any;
}
export interface IValidateSchemaProperties {
  [x: string]: IValidateSchema;
}
export const pathPublicKey = config.server.public_key;
export class BaseController {
  constructor() {
    this.router = express.Router();
  }
  path: string | undefined;
  router: express.Router;
  onError(res: Response, error: any) {
    // Raven.captureException(error);
    if (!error.options) {
      console.log("UNKNOW ERROR", error);
      const err = errorService.router.somethingWentWrong();
      res.status(err.options.statusCode).json(err.options);
    } else {
      res.status(error.options.statusCode).json(error.options);
    }
  }
  onEncryptError(res: Response, error: any) {
    // Raven.captureException(error);

    if (!error.options) {
      console.log("UNKNOW ERROR", error);
      const err = errorService.router.somethingWentWrong();
      res.status(err.options.statusCode).json({
        data: cryptoService.encryptStringWithRsaPublicKey(
          error.options,
          pathPublicKey
        ),
      });
    } else {
      res.status(error.options.statusCode).json({
        data: cryptoService.encryptStringWithRsaPublicKey(
          error.options,
          pathPublicKey
        ),
      });
    }
  }

  onSuccess(res: Response, object: any = {}, extras: any = {}) {
    object = object || {};
    if (Object.keys(object).length === 0) {
      res.status(200).json({}).end();
    } else {
      res
        .status(200)
        .json({
          ...object,
          ...extras,
        })
        .end();
    }
  }

  onEncryptSuccess(res: Response, object: any = {}, extras: any = {}) {
    object = object || {};
    let data = {};
    if (Object.keys(object).length === 0) {
      data = {};
    } else {
      data = {
        ...object,
        ...extras,
      };
    }

    res
      .status(200)
      .json({
        data: cryptoService.encryptStringWithRsaPublicKey(data, pathPublicKey),
      })
      .end();
  }

  onSuccessAsList(res: Response, objects: any = [], extras: any = {}) {
    if (objects.toJSON) {
      objects = objects.toJSON();
    }
    const queryPage = res.req.query["page"];
    const queryLimit = res.req.query["limit"];
    const page = typeof queryPage == "string" ? Number.parseInt(queryPage) : 1;
    const currentPage = page;
    const nextPage = page + 1;
    const prevPage = page - 1;
    const limit =
      queryLimit == UNLIMITED
        ? UNLIMITED
        : typeof queryLimit == "string"
          ? Number.parseInt(queryLimit)
          : config.database.defaultPageSize;
    res.json({
      ...Object.assign(
        objects,
        extras
      ),
      pagination: {
        currentPage,
        nextPage,
        prevPage,
        limit
      },
    });
  }

  onEncryptSuccessAsList(res: Response, objects: any = [], extras: any = {}) {
    if (objects.toJSON) {
      objects = objects.toJSON();
    }
    const queryPage = res.req.query["page"];
    const queryLimit = res.req.query["limit"];
    const page = typeof queryPage == "string" ? Number.parseInt(queryPage) : 1;
    const currentPage = page;
    const nextPage = page + 1;
    const prevPage = page - 1;
    const limit =
      queryLimit == UNLIMITED
        ? UNLIMITED
        : typeof queryLimit == "string"
          ? Number.parseInt(queryLimit)
          : config.database.defaultPageSize;
    const data = {
      ...Object.assign(
        objects,
        extras
      ),
      pagination: {
        currentPage,
        nextPage,
        prevPage,
        limit
      },
    };
    res.json({
      data: cryptoService.encryptStringWithRsaPublicKey(data, pathPublicKey),
    });
  }

  route(func: (req: Request, rep: Response) => Promise<any>) {
    return (req: Request, res: Response) =>
      func
        .bind(this)(req, res)
        .catch((error: any) => {
          console.log("error ===> ", error.options);
          if (!error.options) {
            console.log("UNKNOW ERROR", error);
            error.options = errorService.router.somethingWentWrong().options;
          }
          const errorRes = { ...error };
          error.options = undefined;
          this.onError(res, errorRes);
        });
  }

  routeEncrypt(func: (req: Request, rep: Response) => Promise<any>) {
    return (req: Request, res: Response) =>
      func
        .bind(this)(req, res)
        .catch((error: any) => {
          console.log("error ===> ", error.options);
          if (!error.options) {
            console.log("UNKNOW ERROR", error);
            error.options = errorService.router.somethingWentWrong().options;
          }

          error.options = undefined;
          this.onError(res, error);
        });
  }


  socketIO(req: Request) {
    return req.app.get(SOCKET_EXPRESS) as ServerSocket;
  }
  authMiddlewares(): any[] {
    return [authMiddleware.run()];
  }

  authOrUnAuthMiddlewares(): any[] {
    return [authOrUnAuthMiddleware.run()];
  }

  accountTypeMiddlewares(option?: EAccountType[]): any[] {
    return [accountTypeMiddleware.run(option)];
  }

  systemsMiddlewares(): any[] {
    return [systemMiddleware.run()];
  }
}
