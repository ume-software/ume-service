import { PaymentSystemPlatform } from "@prisma/client";
import {
    ApiModel,
    ApiModelProperty,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";

@ApiModel({
    description: "User information response",
})
export class UserPaymentSystemResponse {
    @ApiModelProperty({
        description: "The username for login",
        required: true,
        example: "a1da9857-355e-43f1-8fdb-26a8a0ace6bd",
        type: SwaggerDefinitionConstant.STRING,
    })
    public id!: string | null;

    @ApiModelProperty({
        description: "Created At",
        example: "2023-05-10T07:08:46.083Z",
    })
    createdAt!: Date;

    @ApiModelProperty({
        description: "Update At",
        example: "2023-05-10T07:08:46.083Z",
    })
    updatedAt!: Date;

    @ApiModelProperty({
        description: "Deleted At",
        example: null,
    })
    deletedAt!: Date;
    @ApiModelProperty({
        description: "The platform",
        required: true,
        example: PaymentSystemPlatform.BIDV,
        enum: Object.values(PaymentSystemPlatform),
        type: SwaggerDefinitionConstant.STRING,
    })
    platform!: PaymentSystemPlatform;

    @ApiModelProperty({
        description: "Slug",
        required: true,
        example: "1274567899123",
    })
    platformAccount!: string;

    @ApiModelProperty({
        description: "name",
        required: true,
        example: "DO TRAN MINH CHU",
        type: SwaggerDefinitionConstant.STRING,
    })
    beneficiary!: string;
    @ApiModelProperty({
        description: "userId",
        example: "a1da9857-355e-43f1-8fdb-26a8a0ace6bd",
    })
    userId!: string;
}
