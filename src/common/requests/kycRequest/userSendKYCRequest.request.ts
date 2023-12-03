import { IsEnum, IsString } from "class-validator";
import {
    ApiModel,
    ApiModelProperty,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import { mappingDataRequest } from "../base";
import { Gender } from "@prisma/client";

@ApiModel({
    description: "User Send KYC Request",
})
export class UserSendKYCRequest {
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
        type: SwaggerDefinitionConstant.DATE,
    })
    citizenDob!: Date;

    @ApiModelProperty({
        description: "citizenGender",
        required: true,
        example: Gender.FEMALE,
        enum: Object.values(Gender),
        type: SwaggerDefinitionConstant.STRING,
    })
    @IsEnum(Gender)
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

    constructor(data: UserSendKYCRequest) {
        if (data) {
            Object.assign(
                this,
                mappingDataRequest(UserSendKYCRequest, data, [
                    "citizenId",
                    "citizenName",
                    "citizenDob",
                    "citizenGender",
                    "frontSideCitizenIdImageUrl",
                    "backSideCitizenIdImageUrl",
                    "portraitImageUrl",
                ])
            );
        }
    }
}
