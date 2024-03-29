import * as fs from "fs";
import { join } from "path";
import { fileService, utilService } from "@/services";
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
import { UploadResponse } from "@/common/responses/upload/upload.response";

const pathFiles = config.server.path_files;
@ApiPath({
    path: "/api//v1/file",
    name: "File",
})
export class FileController extends BaseController {
    constructor() {
        super();
        this.customRouting();
        this.path = "file";
    }
    customRouting() {
        const multer = require("multer");
        var storage = multer.diskStorage({
            destination: function (_req: Request, _file: any, cb: any) {
                if (!fs.existsSync(pathFiles)) {
                    fs.mkdirSync(pathFiles);
                }
                cb(null, pathFiles);
            },
            filename: function (_req: Request, file: any, cb: any) {
                cb(null, utilService.revokeFileName(file.originalname));
            },
        });

        const upload = multer({ storage: storage });

        this.router.get("/:filename", this.route(this.getFile));
        this.router.post("/", upload.array("files"), this.route(this.upload));
    }

    @ApiOperationGet({
        path: "/{filename}",
        operationId: "getFile",
        description: "Get file by filename",
        summary: "Get file",
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
                description: "Get file success",
            },
        },
    })
    async getFile(req: Request, res: Response) {
        const { filename } = req.params;
        const pathFileName = join(pathFiles, decodeURIComponent(`${filename}`));

        fs.exists(pathFileName, function (exists) {
            if (exists) {
                fs.readFile(pathFileName, function (err, data) {
                    if (!err) {
                        res.setHeader(
                            "Content-Type",
                            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        );
                        res.setHeader(
                            "Content-Disposition",
                            `attachment; filename="${filename}"`
                        );
                        //   res.setHeader("Content-Type", "audio/mpeg");
                        res.end(data);
                    }
                });
            } else {
                res.writeHead(500, { "Content-Type": "application/json" });
                res.write(`{
                              "code": 500,
                              "type": "database_exception_query_fail",
                              "message": "File does not exist"
                          }`);
                res.end();
            }
        });
    }

    @ApiOperationPost({
        path: "",
        operationId: "uploadFile",
        description: "Upload file",
        summary: "Upload file",
        parameters: {
            path: hostLanguageParameter,
        },
        requestBody: {
            description: "Upload multiple file",
            required: true,
            content: {
                [SwaggerDefinitionConstant.Produce.FORM_DATA]: {
                    schema: {
                        type: SwaggerDefinitionConstant.Model.Type.OBJECT,
                        properties: {
                            files: {
                                type: SwaggerDefinitionConstant.Model.Type
                                    .ARRAY,
                                items: {
                                    type: SwaggerDefinitionConstant.Model
                                        .Property.Type.STRING,
                                    format: SwaggerDefinitionConstant.Model
                                        .Property.Format.BINARY,
                                },
                            },
                        },
                    },
                },
            },
        },
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: UploadResponse },
                    },
                },
                description: "Response post success",
            },
        },
    })
    async upload(req: Request, res: Response) {
        const pathnames = await fileService.upload(req, "api/v1/file");
        this.onSuccess(res, { results: pathnames });
    }
}
