import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";
import {
    ApiModel,
    ApiModelProperty,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import { mappingDataRequest } from "../base";

@ApiModel({
    description: "Update banner request",
})
export class UpdateBannerRequest {
    @ApiModelProperty({
        description: "Image Url",
        required: true,
        example: "Image url",
        type: SwaggerDefinitionConstant.STRING,
    })
    @IsString()
    imageUrl!: string | null;

    @ApiModelProperty({
        description: "position",
        required: true,
        example: 1,
        type: SwaggerDefinitionConstant.NUMBER,
    })
    @IsNumber()
    position!: number | null;

    @ApiModelProperty({
        description: "Is Activated",
        required: false,
        example: true,

        type: SwaggerDefinitionConstant.BOOLEAN,
    })
    @IsOptional()
    @IsBoolean()
    isActivated!: Boolean | null;

    constructor(data: UpdateBannerRequest) {
        if (data) {
            Object.assign(
                this,
                mappingDataRequest(UpdateBannerRequest, data, [
                    "imageUrl",
                    "position",
                    "isActivated",
                ])
            );
        }
    }
}
