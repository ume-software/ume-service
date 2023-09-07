import { IBaseErrorOption } from "@/services/errors";
import {
    IApiOperationArgsBaseResponse,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";

export function MappingErrorResponseSwaggerApi(
    errors: Array<IBaseErrorOption>
): {
    [key: string]: IApiOperationArgsBaseResponse;
} {
    const results: {
        [key: string]: IApiOperationArgsBaseResponse;
    } = {};
    for (const error of errors) {
        results[error.statusCode] = {
            content: {
                [SwaggerDefinitionConstant.Produce.JSON]: {
                    schema: {
                        properties: {
                            message: {
                                type: SwaggerDefinitionConstant.STRING,
                                example: error.message,
                            },
                            key: {
                                type: SwaggerDefinitionConstant.STRING,
                                example: "xxx_exception_xxxxx_xxxx",
                            },
                            statusCode: {
                                type: SwaggerDefinitionConstant.NUMBER,
                                example: error.statusCode,
                            },
                            codeNumber: {
                                type: SwaggerDefinitionConstant.NUMBER,
                                example: error.codeNumber,
                            }
                        },
                    },
                },
            },
            description: error.description ?? "This is error.",
        };
    }
    return results;
}
