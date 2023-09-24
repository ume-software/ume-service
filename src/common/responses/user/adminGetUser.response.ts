import { Gender, LoginType } from "@prisma/client";
import {
    ApiModel,
    ApiModelProperty,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import { ProviderServiceResponse } from "../providerService";
import { ProviderConfigResponse } from "../providerConfig";
@ApiModel({
    description: "User information reponse",
})
export class AdminGetUserResponseResponse {
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
        description: "User online",
        required: false,
        example: true,
        type: SwaggerDefinitionConstant.BOOLEAN,
    })
    public isOnline!: Boolean;

    @ApiModelProperty({
        description: "User banned",
        required: false,
        example: true,
        type: SwaggerDefinitionConstant.BOOLEAN,
    })
    public isBanned!: Boolean;

    @ApiModelProperty({
        description: "Latest time user online",
        required: false,
        example: true,
        type: SwaggerDefinitionConstant.BOOLEAN,
    })
    public latestOnline!: Boolean;

    @ApiModelProperty({
        description: "User verified",
        required: false,
        example: true,
        type: SwaggerDefinitionConstant.BOOLEAN,
    })
    public isVerified!: Boolean;

    @ApiModelProperty({
        description: "providerServices",
        type: SwaggerDefinitionConstant.ARRAY,
        itemType: ProviderServiceResponse,
    })
    providerServices!: Array<ProviderServiceResponse>;

    @ApiModelProperty({
        description: "providerServices",
        model: ProviderConfigResponse,
    })
    providerConfig!: ProviderConfigResponse;
}
