import { IsEnum, IsOptional, IsString, IsUUID } from "class-validator";
import { ApiModel, ApiModelProperty } from "express-swagger-typescript";
import { AdminResponse } from "../admin";
import { UserInformationResponse } from "../user";
import { Gender, UserKYCStatus } from "@prisma/client";

@ApiModel({
    description: "User Send KYC Request Response",
})
export class UserKYCRequestResponse {
    @ApiModelProperty({
        description: "Id",
        required: true,
        example: "3646a0ae-494a-4cef-876c-1f578c3d6b8d",
    })
    @IsUUID()
    id!: string;

    @ApiModelProperty({
        description: "citizenId",
        required: true,
        example: "0912345567",
    })
    @IsString()
    citizenId!: string;

    @ApiModelProperty({
        description: "citizenName",
        required: true,
        example: "ĐỖ TRẦN MINH CHU",
    })
    @IsString()
    citizenName!: string;

    @ApiModelProperty({
        description: "citizenDob",
        required: true,
        example: new Date(),
    })
    @IsString()
    citizenDob!: Date;

    @ApiModelProperty({
        description: "citizenGender",
        required: true,
        example: Gender.FEMALE,
    })
    @IsString()
    citizenGender!: Gender;

    @ApiModelProperty({
        description: "frontSideCitizenIdImageUrl",
        required: true,
        example: "https://asp.misa.vn/wp-content/uploads/2023/03/23.jpg",
    })
    @IsString()
    frontSideCitizenIdImageUrl!: string;

    @ApiModelProperty({
        description: "backSideCitizenIdImageUrl",
        required: true,
        example: "https://asp.misa.vn/wp-content/uploads/2023/03/23.jpg",
    })
    @IsString()
    backSideCitizenIdImageUrl!: string;

    @ApiModelProperty({
        description: "portraitImageUrl",
        required: true,
        example:
            "https://global-oss.epal.gg/data/cover/1973809/16862433098586045.jpeg",
    })
    @IsString()
    portraitImageUrl!: string;

    @ApiModelProperty({
        description: "adminId",
        required: false,
        example: "3646a0ae-494a-4cef-876c-1f578c3d6b8d",
    })
    @IsOptional()
    @IsString()
    adminId!: string;

    @ApiModelProperty({
        description: "admin",
        required: false,
        model: AdminResponse,
    })
    @IsOptional()
    @IsString()
    admin!: AdminResponse;

    @ApiModelProperty({
        description: "userId",
        required: true,
        example: "3646a0ae-494a-4cef-876c-1f578c3d6b8d",
    })
    @IsString()
    userId!: string;

    @ApiModelProperty({
        description: "user",
        required: false,
        model: UserInformationResponse,
    })
    @IsOptional()
    @IsString()
    user!: UserInformationResponse;

    @ApiModelProperty({
        description: "User KYC status",
        required: true,
        example: UserKYCStatus.APPROVED,
        enum: Object.values(UserKYCStatus),
    })
    @IsEnum(UserKYCStatus)
    userKYCStatus!: UserKYCStatus;
}
