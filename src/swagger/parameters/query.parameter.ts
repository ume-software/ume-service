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
  ...limitParameter,
  ...pageParameter,
  ...selectParameter,
  ...whereParameter,
  ...orderParameter
};

export const filterProviderParameters = {
  start_cost: {
    name: "start_cost",
    required: false,
    schema: {
      type: SwaggerDefinitionConstant.Parameter.Type.NUMBER,
      default: 5,
    },
    description: `
        Example : start_cost=5
        `,
  },
  end_cost: {
    name: "end_cost",
    required: false,
    schema: {
      type: SwaggerDefinitionConstant.Parameter.Type.NUMBER,
      default: 10,
    },
    description: `
        Example : end_cost=5
        `,
  },
  skill_id: {
    name: "skill_id",
    required: false,
    schema: {
      type: SwaggerDefinitionConstant.Parameter.Type.STRING,
      default: "14476c02-2846-4097-8f00-b495e8fc77ae",
    },
    description: `
        Example : skill_id=14476c02-2846-4097-8f00-b495e8fc77ae
        `,
  },
};
export const filterHotProviderParameters = {
  interval_days: {
    name: "interval_days",
    required: true,
    schema: {
      type: SwaggerDefinitionConstant.Parameter.Type.NUMBER,
      default: 7,
    },
    description: `
        Example : interval_days=7
        `,
  },
};
