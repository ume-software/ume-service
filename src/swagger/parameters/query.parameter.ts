import { IHostLanguage } from "@/enums/hostLanguage.enum";
import { EIntervalUnit } from "@/enums/intervalUnit.enum";
import { ETopDonationDuration } from "@/enums/topDonationDuration.enum";
import { DepositRequestStatus, Gender, ProviderStatus } from "@prisma/client";
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
    ...orderParameter,
};

export const filterProviderParameters = {
    "start-cost": {
        name: "start-cost",
        required: false,
        schema: {
            type: SwaggerDefinitionConstant.Parameter.Type.NUMBER,
            default: 5,
        },
        description: `
        Example : start-cost=5
        `,
    },
    "end-cost": {
        name: "end-cost",
        required: false,
        schema: {
            type: SwaggerDefinitionConstant.Parameter.Type.NUMBER,
            default: 10,
        },
        description: `
        Example : end-cost=5
        `,
    },
    "service-id": {
        name: "service-id",
        required: false,
        schema: {
            type: SwaggerDefinitionConstant.Parameter.Type.STRING,
            default: "14476c02-2846-4097-8f00-b495e8fc77ae",
        },
        description: `
        Example : service-id=14476c02-2846-4097-8f00-b495e8fc77ae
        `,
    },
    "service-attribute-value-ids": {
        name: "service-attribute-value-ids",
        required: false,
        schema: {
            type: SwaggerDefinitionConstant.Parameter.Type.ARRAY,
            items: {
                type: SwaggerDefinitionConstant.Parameter.Type.STRING,
            },
            // default: "14476c02-2846-4097-8f00-b495e8fc77ae",
        },
        description: `
        Example : service-attribute-value-id=14476c02-2846-4097-8f00-b495e8fc77ae
        `,
    },
    name: {
        name: "name",
        required: false,
        schema: {
            type: SwaggerDefinitionConstant.Parameter.Type.STRING,
            default: "name",
        },
        description: `
        Example : name=dotranminhchu
        `,
    },
    gender: {
        name: "gender",
        required: false,
        schema: {
            enum: Object.values(Gender),
            example: Gender.MALE,
            default: Gender.MALE,
        },
        description: `
        Example : gender=MALE
        `,
    },
    status: {
        name: "status",
        required: false,
        schema: {
            enum: Object.values(ProviderStatus),
            example: ProviderStatus.ACTIVATED,
            default: ProviderStatus.ACTIVATED,
        },
        description: `
        Example : status=ACTIVATED
        `,
    },
    "is-online": {
        name: "is-online",
        schema: {
            type: SwaggerDefinitionConstant.Parameter.Type.BOOLEAN,
            example: true,
            default: true,
        },
        description: `
        Example : is-online=true
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

export const handlerFilterDepositParameters = {
    ...limitParameter,
    ...pageParameter,
    ...orderParameter,
    status: {
        name: "status",
        required: false,
        schema: {
            type: SwaggerDefinitionConstant.Parameter.Type.STRING,
            default: DepositRequestStatus.INIT,
        },
        description: `
        Example : status=${DepositRequestStatus.INIT}
        `,
    },
    transaction_code: {
        name: "transaction_code",
        required: false,
        schema: {
            type: SwaggerDefinitionConstant.Parameter.Type.STRING,
        },
        description: `
        Example : transaction_code=1LUDPOFOF507062023105048841
        `,
    },
};

export const filterTopDonationParameters = {
    duration: {
        name: "duration",
        required: true,
        schema: {
            enum: Object.values(ETopDonationDuration),
            example: ETopDonationDuration.ONE_YEAR,
            default: ETopDonationDuration.ONE_YEAR,
        },
        description: `
        Example : duration=1Y
        `,
    },
    top: {
        name: "top",
        required: true,
        schema: {
            type: SwaggerDefinitionConstant.NUMBER,
            example: 10,
            default: 10,
        },
        description: `
        Example : top=10
        `,
    },
};

export const intervalStatisticParameters: IApiParameters = {
    time: {
        name: "time",
        required: true,
        schema: {
            type: SwaggerDefinitionConstant.Parameter.Type.NUMBER,
            default: 1,
        },
        description: `
        Example : time=12
        `,
    },
    unit: {
        name: "unit",
        required: true,
        schema: {
            type: SwaggerDefinitionConstant.Parameter.Type.STRING,
            default: EIntervalUnit.months,
            enum: Object.values(EIntervalUnit),
        },
        description: `
        Example : unit=${EIntervalUnit.months}
        `,
    },
    ["gap-unit"]: {
        name: "gap_unit",
        required: true,
        schema: {
            type: SwaggerDefinitionConstant.Parameter.Type.STRING,
            default: EIntervalUnit.months,
            enum: Object.values(EIntervalUnit),
        },
        description: `
        Example : gap-unit=${EIntervalUnit.months}
        `,
    },
};
