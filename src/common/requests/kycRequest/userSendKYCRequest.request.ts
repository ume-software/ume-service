import { IsString } from "class-validator";
import { ApiModel, ApiModelProperty } from "express-swagger-typescript";
import { mappingDataRequest } from "../base";

@ApiModel({
    description: "User Send KYC Request",
})
export class UserSendKYCRequest {
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
                    "frontSideCitizenIdImageUrl",
                    "backSideCitizenIdImageUrl",
                    "portraitImageUrl",
                ])
            );
        }
    }
}
