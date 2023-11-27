import { Gender, LoginType } from "@prisma/client";
import {
    ApiModel,
    ApiModelProperty,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import { ProviderServiceResponse } from "../providerService";
import { ProviderConfigResponse } from "../providerConfig";
import { VoucherResponse } from "../voucher";

@ApiModel({
    description: "User information reponse",
})
export class UserInformationResponse {
    @ApiModelProperty({
        description: "The username for login",
        required: true,
        example: "a1da9857-355e-43f1-8fdb-26a8a0ace6bd",
        type: SwaggerDefinitionConstant.STRING,
    })
    public id!: string | null;

    @ApiModelProperty({
        description: "The username for login",
        required: true,
        example: "username",
        type: SwaggerDefinitionConstant.STRING,
    })
    public username!: string | null;

    @ApiModelProperty({
        description: "Slug",
        required: true,
        example: "do-tran-minh-chu",
        type: SwaggerDefinitionConstant.STRING,
    })
    slug!: string | null;

    @ApiModelProperty({
        description: "name",
        required: true,
        example: "name",
        type: SwaggerDefinitionConstant.STRING,
    })
    public name!: string | null;

    @ApiModelProperty({
        description: "gender",
        required: true,
        enum: Object.values(Gender),
        example: "name",
        type: SwaggerDefinitionConstant.STRING,
    })
    public gender!: Gender;

    @ApiModelProperty({
        description: "day of birth",
        required: false,
        example: "2023-02-08T07:25:50.009Z",
        type: SwaggerDefinitionConstant.STRING,
    })
    public dob?: Date | null;

    @ApiModelProperty({
        description: "phone",
        required: false,
        example: "0123456789",
        type: SwaggerDefinitionConstant.STRING,
    })
    public phone?: string | null;

    @ApiModelProperty({
        description: "email",
        required: true,
        example: "email@gmail.com",
        type: SwaggerDefinitionConstant.STRING,
    })
    public email!: string | null;

    @ApiModelProperty({
        description: "loginType",
        required: true,
        enum: Object.values(LoginType),
        example: LoginType.GOOGLE,
        type: SwaggerDefinitionConstant.STRING,
    })
    public loginType!: LoginType | null;

    @ApiModelProperty({
        description: "avatar url",
        required: false,
        example:
            "https://lh3.googleusercontent.com/a/AAcHTtfxbwWNIPBNhWJ6V_oTzH_Ea6ocmhgs0uIpo8c6=s96-c",
        type: SwaggerDefinitionConstant.STRING,
    })
    public avatarUrl!: string | null;

    @ApiModelProperty({
        description: "IP V4",
        required: false,
        example: "0.000.000",
        type: SwaggerDefinitionConstant.STRING,
    })
    public ipv4!: string | null;

    @ApiModelProperty({
        description: "Is online",
        required: true,
        example: true,
        type: SwaggerDefinitionConstant.BOOLEAN,
    })
    public isOnline!: boolean | null;

    @ApiModelProperty({
        description: "Latest time online",
        required: false,
        example: "2023-02-08T07:25:50.009Z",
        type: SwaggerDefinitionConstant.DATE,
    })
    public latestOnline!: Date | null;

    @ApiModelProperty({
        description: "Is banned",
        required: true,
        example: true,
        type: SwaggerDefinitionConstant.BOOLEAN,
    })
    public isBanned!: boolean | null;

    @ApiModelProperty({
        description: "Is verified",
        required: true,
        example: true,
        type: SwaggerDefinitionConstant.BOOLEAN,
    })
    public isVerified!: boolean | null;

    @ApiModelProperty({
        description: "Is provider",
        required: true,
        example: true,
        type: SwaggerDefinitionConstant.BOOLEAN,
    })
    public isProvider!: boolean | null;

    @ApiModelProperty({
        description: "Is allow notification to email",
        required: true,
        example: true,
        type: SwaggerDefinitionConstant.BOOLEAN,
    })
    public isAllowNotificationToEmail!: boolean;

    @ApiModelProperty({
        description: "Is allow notification message",
        required: true,
        example: true,
        type: SwaggerDefinitionConstant.BOOLEAN,
    })
    public isAllowNotificationMessage!: boolean;

    @ApiModelProperty({
        description: "Is allow notification call",
        required: true,
        example: true,
        type: SwaggerDefinitionConstant.BOOLEAN,
    })
    public isAllowNotificationCall!: boolean;

    @ApiModelProperty({
        description: "providerServices",
        type: SwaggerDefinitionConstant.ARRAY,
        required: false,
        itemType: ProviderServiceResponse,
    })
    providerServices?: Array<ProviderServiceResponse>;

    @ApiModelProperty({
        description: "providerServices",
        required: false,
        model: ProviderConfigResponse,
    })
    providerConfig?: ProviderConfigResponse;

    @ApiModelProperty({
        description: "providerVouchers",
        required: false,
        model: VoucherResponse,
    })
    vouchers?: VoucherResponse;
}
