import * as yaml from "js-yaml";
import * as fs from "fs";
import * as swagger from "express-swagger-typescript";
import { ErrorResponse } from "@/common/responses/error/error.response";
import { config } from "@/configs";
import { ERROR_MESSAGE } from "@/services/errors/errorMessage";

const swaggerData: any = swagger.swaggerData({
    definition: {
        openapi: "3.0.0",
        info: {
            title: "My api",
            version: "1.0",
        },
        prefixPath: config.server.prefixPath.value,
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        responses: {
            500: {
                content: {
                    [swagger.SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: ErrorResponse },
                    },
                },
                description:
                    ERROR_MESSAGE.SORRY_SOMETHING_WENT_WRONG.description,
            },
        },
        externalDocs: {
            url: "",
        },
    },
});

if (config.server.is_localhost) {
    fs.writeFileSync("swagger.yml", yaml.dump(swaggerData));

    console.log("Swagger YAML file created successfully.");
}

export default swaggerData;
