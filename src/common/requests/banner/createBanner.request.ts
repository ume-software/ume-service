import { IsBoolean, IsOptional, IsString } from "class-validator";
import {
    ApiModel,
    ApiModelProperty,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import { mappingDataRequest } from "../base";

@ApiModel({
    description: "Create banner request",
})
export class CreateBannerRequest {
    @ApiModelProperty({
        description: "Image Url",
        required: true,
        example: "Image url",
        type: SwaggerDefinitionConstant.STRING,
    })
    @IsString()
    imageUrl!: string;

    @ApiModelProperty({
        description: "Is Activated",
        required: false,
        example: true,

        type: SwaggerDefinitionConstant.BOOLEAN,
    })
    @IsOptional()
    @IsBoolean()
    isActivated?: Boolean;

    constructor(data: CreateBannerRequest) {
        if (data) {
            Object.assign(
                this,
                mappingDataRequest(CreateBannerRequest, data, [
                    "imageUrl",
                    "isActivated",
                ])
            );
        }
    }
}
