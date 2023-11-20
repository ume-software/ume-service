import { AdminRoleType, Gender } from "@prisma/client";
import {
    ApiModel,
    ApiModelProperty,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import { mappingDataRequest } from "../base";
import { IsBoolean, IsEnum, IsOptional, IsString } from "class-validator";

@ApiModel({
    description: "Update account request",
})
export class UpdateAdminAccountRequest {
    @ApiModelProperty({
        description: "Fullname of user",
        required: true,
        example: "Do Tran Minh Chu",
    })
    @IsOptional()
    @IsString()
    public name!: string;

    @ApiModelProperty({
        description: `Day of birth by format YYYY-MM-DDTHH:mm:ssZ
        </br>
        Example : 2001-10-13T00:00:00+07:00`,
        required: false,
        example: "2001-10-13T00:00:00+07:00",
    })
    @IsOptional()
    public dob?: Date;

    @ApiModelProperty({
        description: `Gender`,
        required: true,
        example: Gender.MALE,
    })
    @IsOptional()
    @IsEnum(Gender)
    public gender!: Gender;

    @ApiModelProperty({
        description: `Url avatar`,
        required: false,
        example:
            "https://haycafe.vn/wp-content/uploads/2022/02/anh-meo-cute-hinh-cute-meo.jpg",
    })
    @IsOptional()
    @IsString()
    public avatarUrl?: string;

    @ApiModelProperty({
        description: `Email`,
        required: false,
        example: "dotranminhchu@gmail.com",
    })
    @IsOptional()
    @IsString()
    public email?: string;

    @ApiModelProperty({
        description: `Phone number`,
        required: false,
        example: "0123456789",
    })
    @IsOptional()
    @IsString()
    public phone?: string;

    @ApiModelProperty({
        description: "password",
        required: true,
        example: "password",
    })
    @IsOptional()
    @IsString()
    public password!: string;

    @ApiModelProperty({
        description: "Is activated",
        required: true,
        example: false,
    })
    @IsOptional()
    @IsBoolean()
    public isActivated!: boolean;

    @ApiModelProperty({
        description: "admin roles",
        required: false,
        type: SwaggerDefinitionConstant.ARRAY,
        enum: Object.values(AdminRoleType),
        itemType: SwaggerDefinitionConstant.STRING,
        example: [AdminRoleType.ADMIN],
    })
    @IsOptional()
    public roles!: Array<AdminRoleType>;
    constructor(data: UpdateAdminAccountRequest) {
        if (data) {
            Object.assign(
                this,
                mappingDataRequest(UpdateAdminAccountRequest, data, [
                    "name",
                    "dob",
                    "gender",
                    "avatarUrl",
                    "email",
                    "phone",
                    "password",
                    "isActivated",
                    "roles",
                ])
            );
        }
    }
}
