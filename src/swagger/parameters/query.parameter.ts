import { IHostLanguage } from "@/enums/hostLanguage.enum";
import {
  IApiParameters,
  SwaggerDefinitionConstant,
} from "express-swagger-typescript";

export const hostLanguageParameter: IApiParameters = {
  hl: {
    name: "hl",
    required: false,
    schema: {
      type: SwaggerDefinitionConstant.Parameter.Type.STRING,
      enum: Object.values(IHostLanguage),
      default: IHostLanguage.en,
    },
  },
};

export const selectParameter: IApiParameters = {
  select: {
    name: "select",
    required: false,
    schema: {
      type: SwaggerDefinitionConstant.Parameter.Type.STRING,
      default: '["$all"]',
    },
    description: `
        Example : select=["$all"]
    `,
  },
};

export const whereParameter: IApiParameters = {
  where: {
    name: "where",
    required: false,
    schema: {
      type: SwaggerDefinitionConstant.Parameter.Type.STRING,
      default: "{}",
    },
    description: `
        Example : where={"name":{"contains":"Minh"}}
    `,
  },
};

export const limitParameter: IApiParameters = {
  limit: {
    name: "limit",
    required: false,
    schema: {
      type: SwaggerDefinitionConstant.Parameter.Type.STRING,
      default: "unlimited",
    },
    description: `
        Example : limit=50
                : limit=unlimited
    `,
  },
};
export const pageParameter: IApiParameters = {
  page: {
    name: "page",
    required: false,
    schema: {
      type: SwaggerDefinitionConstant.Parameter.Type.STRING,
      default: "1",
    },
  },
};
export const orderParameter: IApiParameters = {
  order: {
    name: "order",
    required: false,
    schema: {
      type: SwaggerDefinitionConstant.Parameter.Type.STRING,
      default: "[]",
    },
    description: `
        Example : order=[{"updatedAt":"asc"}]
        `,
  },
};

export const queryParameters = {
  ...hostLanguageParameter,
  ...selectParameter,
  ...whereParameter,
  ...limitParameter,
  ...pageParameter,
  ...orderParameter,
};
