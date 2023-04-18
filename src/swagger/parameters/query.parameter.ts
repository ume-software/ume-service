import { IHostLanguage } from "@/enums/hostLanguage.enum";
import { IApiParameters, SwaggerDefinitionConstant } from "express-swagger-typescript";

export const hostLanguageParameter: IApiParameters = {
    hl: {
        name: "hl",
        required: false,
        schema: {
            type: SwaggerDefinitionConstant.Parameter.Type.STRING,
            enum: Object.values(IHostLanguage),
            default: IHostLanguage.en,
        }
    }
}


export const fieldsParameter: IApiParameters = {
    fields: {
        name: "fields",
        required: false,
        schema: {
            type: SwaggerDefinitionConstant.Parameter.Type.STRING,
            default: '["$all"]',
        }
    }
}

export const whereParameter: IApiParameters = {
    where: {
        name: "where",
        required: false,
        schema: {
            type: SwaggerDefinitionConstant.Parameter.Type.STRING,
            default: '{}',
        }
    }
}

export const limitParameter: IApiParameters = {
    limit: {
        name: "limit",
        required: false,
        schema: {
            type: SwaggerDefinitionConstant.Parameter.Type.STRING,
            default: 'unlimited',
        }
    }
}
export const pageParameter: IApiParameters = {
    page: {
        name: "page",
        required: false,
        schema: {
            type: SwaggerDefinitionConstant.Parameter.Type.STRING,
            default: '1',
        }
    }
}
export const orderParameter: IApiParameters = {
    order: {
        name: "order",
        required: false,
        schema: {
            type: SwaggerDefinitionConstant.Parameter.Type.STRING,
            default: '[]',
        },
        description:`
        In Prisma : [{"updatedAt":"asc"}]
        In sequelize: [["updateAt","asc"]]
        `
    }
}
