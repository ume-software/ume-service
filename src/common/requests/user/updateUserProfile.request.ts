import { Gender } from "@prisma/client";
import {
    ApiModel,
    ApiModelProperty,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import { mappingDataRequest } from "../base";
import {
    IsBoolean,
    IsDate,
    IsEnum,
    IsOptional,
    IsString,
} from "class-validator";
import { Type } from "class-transformer";
@ApiModel({
    description: "Update user profile request",
})
export class UpdateUserProfileRequest {
    @ApiModelProperty({
        description: "name",
        required: false,
        example: "name",
        type: SwaggerDefinitionConstant.STRING,
    })
    @IsOptional()
    @IsString()
    public name!: string | null;

    @ApiModelProperty({
        description: "slug",
        required: false,
        example: "slug",
        type: SwaggerDefinitionConstant.STRING,
    })
    @IsOptional()
    @IsString()
    public slug!: string | null;

    @ApiModelProperty({
        description: "gender",
        required: false,
        enum: Object.values(Gender),
        example: Gender.FEMALE,
    })
    @IsOptional()
    @IsEnum(Gender)
    public gender!: Gender;

    @ApiModelProperty({
        description: "day of birth",
        required: false,
        example: "2023-02-08T07:25:50.009Z",
        type: SwaggerDefinitionConstant.DATE,
    })
    @Type(() => Date)
    @IsOptional()
    @IsDate()
    public dob!: Date | null;

    @ApiModelProperty({
        description: "avatar url",
        required: false,
        example:
            "https://lh3.googleusercontent.com/a/AAcHTtfxbwWNIPBNhWJ6V_oTzH_Ea6ocmhgs0uIpo8c6=s96-c",
        type: SwaggerDefinitionConstant.STRING,
    })
    @IsOptional()
    @IsString()
    public avatarUrl!: string | null;

    @ApiModelProperty({
        description: "phone",
        required: false,
        example: "09887654321",
        type: SwaggerDefinitionConstant.STRING,
    })
    @IsOptional()
    @IsString()
    public phone!: string | null;

    @ApiModelProperty({
        description: "isAllowNotificationToEmail",
        required: false,
        example: true,
        type: SwaggerDefinitionConstant.BOOLEAN,
    })
    @IsOptional()
    @IsBoolean()
    isAllowNotificationToEmail?: boolean;

    @ApiModelProperty({
        description: "isAllowNotificationMessage",
        required: false,
        example: true,
        type: SwaggerDefinitionConstant.BOOLEAN,
    })
    @IsOptional()
    @IsBoolean()
    isAllowNotificationMessage?: boolean;

    @ApiModelProperty({
        description: "isAllowNotificationCall",
        required: false,
        example: true,
        type: SwaggerDefinitionConstant.BOOLEAN,
    })
    @IsOptional()
    @IsBoolean()
    isAllowNotificationCall?: boolean;
    constructor(data: UpdateUserProfileRequest) {
        if (data) {
            Object.assign(
                this,
                mappingDataRequest(UpdateUserProfileRequest, data, [
                    "phone",
                    "name",
                    "slug",
                    "gender",
                    "dob",
                    "avatarUrl",
                    "isAllowNotificationToEmail",
                    "isAllowNotificationMessage",
                    "isAllowNotificationCall",
                ])
            );
        }
    }
}
