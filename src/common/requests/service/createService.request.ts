import {
    IsArray,
    IsBoolean,
    IsOptional,
    IsString,
    IsUrl,
} from "class-validator";
import {
    ApiModel,
    ApiModelProperty,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import { mappingDataRequest } from "../base";
import { CreateServiceAttributeRequest } from "./createServiceAttribute.request";
@ApiModel({
    description: "Create service request",
})
export class CreateServiceRequest {
    @ApiModelProperty({
        description: "Service name",
        required: true,
        example: "Identity V",
    })
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
        required: true,
        example:
            "https://cdn.tgdd.vn/2020/06/content/hinh-nen-lien-minh-huyen-thoai-dep-mat-cho-pc-va-dien-thoai-background-800x450.jpg",
    })
    @IsUrl()
    imageUrl!: string;

    @ApiModelProperty({
        description: "Is activated",
        required: false,
        example: true,
    })
    @IsOptional()
    @IsBoolean()
    isActivated?: boolean;

    @ApiModelProperty({
        description: "Create Service Attribute Request",
        required: false,
        type: SwaggerDefinitionConstant.ARRAY,
        itemType: CreateServiceAttributeRequest,
    })
    @IsOptional()
    @IsArray()
    serviceAttributes!: Array<CreateServiceAttributeRequest>;

    constructor(data: CreateServiceRequest) {
        if (data) {
            if (!data.serviceAttributes) data.serviceAttributes = [];
            data.serviceAttributes = data.serviceAttributes.map(
                (serviceAttribute: CreateServiceAttributeRequest) => {
                    return new CreateServiceAttributeRequest(serviceAttribute);
                }
            );
            Object.assign(
                this,
                mappingDataRequest(CreateServiceRequest, data, [
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
