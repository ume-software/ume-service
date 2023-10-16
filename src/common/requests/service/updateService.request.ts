import { IsBoolean, IsOptional, IsString, IsUrl } from "class-validator";
import {
    ApiModel,
    ApiModelProperty,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import { mappingDataRequest } from "../base";
import { HandleServiceAttributeRequest } from "./handleServiceAttribute.request";

@ApiModel({
    description: "Update service request",
})
export class UpdateServiceRequest {
    @ApiModelProperty({
        description: "Service name",
        required: false,
        example: "Identity V",
    })
    @IsOptional()
    @IsString()
    name!: string;

    @ApiModelProperty({
        description: "Service name (VI)",
        required: false,
        example: "Identity V",
    })
    @IsOptional()
    @IsString()
    viName?: string;

    @ApiModelProperty({
        description: "Image url of service",
        required: false,
        example:
            "https://cdn.tgdd.vn/2020/06/content/hinh-nen-lien-minh-huyen-thoai-dep-mat-cho-pc-va-dien-thoai-background-800x450.jpg",
    })
    @IsOptional()
    @IsUrl()
    imageUrl!: string;

    @ApiModelProperty({
        description: "Is activated",
        required: false,
        example: true,
    })
    @IsOptional()
    @IsBoolean()
    isActivated!: boolean;

    @ApiModelProperty({
        description: "Create Service Attribute Request",
        required: false,
        type: SwaggerDefinitionConstant.ARRAY,
        itemType: HandleServiceAttributeRequest,
    })
    @IsOptional()
    @IsBoolean()
    serviceAttributes!: Array<HandleServiceAttributeRequest>;

    constructor(data: UpdateServiceRequest) {
        if (data) {
            if (!data.serviceAttributes) data.serviceAttributes = [];
            data.serviceAttributes = data.serviceAttributes.map(
                (serviceAttribute: HandleServiceAttributeRequest) => {
                    return new HandleServiceAttributeRequest(serviceAttribute);
                }
            );
            Object.assign(
                this,
                mappingDataRequest(UpdateServiceRequest, data, [
                    "name",
                    "viName",
                    "imageUrl",
                    "isActivated",
                    "serviceAttributes",
                ])
            );
        }
    }
}
