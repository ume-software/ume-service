import { Gender } from "@prisma/client";
import { Type } from "class-transformer";
import { IsString, IsDate, IsEnum, IsOptional } from "class-validator";
import { ApiModel, ApiModelProperty } from "express-swagger-typescript";
import { mappingDataRequest } from "../base";

@ApiModel({
    description: "Register request",
})
export class RegisterInAppRequest {
    @ApiModelProperty({
        description: "Fullname of user",
        required: true,
        example: "Do Tran Minh Chu",
    })
    @IsString()
    public name!: string;

    @ApiModelProperty({
        description: `Day of birth by format YYYY-MM-DDTHH:mm:ssZ
        </br>
        Example : 2001-10-13T00:00:00+07:00`,
        required: false,
        example: "2001-10-13T00:00:00+07:00",
    })
    @Type(() => Date)
    @IsOptional()
    @IsDate()
    public dob!: Date;

    @ApiModelProperty({
        description: `Gender`,
        required: true,
        example: Gender.MALE,
    })
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
    public avatarUrl!: string;

    @ApiModelProperty({
        description: `Email`,
        required: false,
        example: "dotranminhchu@gmail.com",
    })
    @IsOptional()
    @IsString()
    public email!: string;

    @ApiModelProperty({
        description: `Phone number`,
        required: false,
        example: "0123456789",
    })
    @IsOptional()
    @IsString()
    public phone!: string;

    @ApiModelProperty({
        description: "The username for login",
        required: true,
        example: "username",
    })
    @IsString()
    public username!: string;

    @ApiModelProperty({
        description: "password",
        required: true,
    })
    @IsString()
    public password!: string;

    constructor(data: RegisterInAppRequest) {
        if (data) {
            Object.assign(
                this,
                mappingDataRequest(RegisterInAppRequest, data, [
                    "name",
                    "dob",
                    "gender",
                    "avatarUrl",
                    "email",
                    "phone",
                    "username",
                    "password",
                ])
            );
        }
    }
}
