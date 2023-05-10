import * as fs from "fs";
import { join } from "path";
import { imageService, utilService } from "@/services";
import { Request, Response } from "express";
import { config } from "@/configs";
import { BaseController } from "@/controllers/base/base.controller";
import {
  ApiOperationGet,
  ApiOperationPost,
  ApiPath,
  SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import { hostLanguageParameter } from "@/swagger/parameters/query.parameter";

const pathImages = config.server.path_images;

@ApiPath({
  path: "/api/image",
  name: "Image",
})
export class ImageController extends BaseController {
  constructor() {
    super();
    this.customRouting();
    this.path = "image";
  }
  customRouting() {
    const multer = require("multer");
    var storage = multer.diskStorage({
      destination: function (_req: Request, _file: any, cb: any) {
        if (!fs.existsSync(pathImages)) {
          fs.mkdirSync(pathImages);
        }
        cb(null, pathImages);
      },
      filename: function (_req: Request, file: any, cb: any) {
        cb(null, utilService.revokeFileName(file.originalname));
      },
    });

    const upload = multer({ storage: storage });

    this.router.get("/:filename", this.route(this.getImage));
    this.router.post("/", upload.array("files"), this.route(this.upload));
  }

  @ApiOperationGet({
    path: "/{filename}",
    operationId: "getImage",
    description: "Get image by filename",
    summary: "Get image",
    parameters: {
      path: {
        filename: {
          required: true,
          schema: {
            type: SwaggerDefinitionConstant.Parameter.Type.STRING,
          },
        },
      },
    },
    responses: {
      200: {
        description: "Get image success",
      },
    },
  })
  async getImage(req: Request, res: Response) {
    const { filename } = req.params;
    const pathFileName = join(pathImages, decodeURIComponent(`${filename}`));

    fs.exists(pathFileName, function (exists) {
      if (exists) {
        fs.readFile(pathFileName, function (err, data) {
          if (!err) {
            res.writeHead(200, { "Content-Type": "image/png,image/gif" });
            res.end(data);
          }
        });
      } else {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.write(`{
                              "code": 500,
                              "type": "database_exception_query_fail",
                              "message": "Image does not exist"
                          }`);
        res.end();
      }
    });
  }

  @ApiOperationPost({
    path: "",
    operationId: "uploadImage",
    description: "Upload image",
    summary: "Upload image",
    parameters: {
      path: hostLanguageParameter,
    },
    requestBody: {
      description: "Upload multiple image",
      required: true,
      content: {
        [SwaggerDefinitionConstant.Produce.FORM_DATA]: {
          schema: {
            type: SwaggerDefinitionConstant.Model.Type.OBJECT,
            properties: {
              width: {
                type: SwaggerDefinitionConstant.Model.Property.Type.INTEGER,
              },
              height: {
                type: SwaggerDefinitionConstant.Model.Property.Type.INTEGER,
              },
              files: {
                type: SwaggerDefinitionConstant.Model.Type.ARRAY,
                items: {
                  type: SwaggerDefinitionConstant.Model.Property.Type.STRING,
                  format:
                    SwaggerDefinitionConstant.Model.Property.Format.BINARY,
                },
              },
            },
 
          },
        },
      },
    },
    responses: {
      200: {
        description: "Success",
      },
      400: { description: "Parameters fail" },
    },
  })
  async upload(req: Request, res: Response) {
    const pathnames = await imageService.upload(req);
    this.onSuccess(res, pathnames);
  }
}
