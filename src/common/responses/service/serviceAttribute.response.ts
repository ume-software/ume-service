import {
    ApiModel,
    ApiModelProperty,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import { ServiceAttributeValueResponse } from "./serviceAttributeValue.response";

@ApiModel({
    description: "Service attribute response",
})
export class ServiceAttributeResponse {
    @ApiModelProperty({
        description: "Id",
        required: true,
        example: "42ac81c2-1815-45f7-b598-412487161e1f",
    })
    id!: string;

    @ApiModelProperty({
        description: "Service attribute",
        required: true,
        example: "Rank",
    })
    attribute!: string;

    @ApiModelProperty({
        description: "Service attribute (VI)",
        required: false,
        example: "Hạng",
    })
    viAttribute?: string;

    @ApiModelProperty({
        description: "Is activated",
        required: true,
        example: true,
    })
    isActivated!: boolean;

    @ApiModelProperty({
        description: "Create Service Attribute Value Request",
        required: false,
        type: SwaggerDefinitionConstant.ARRAY,
        itemType: ServiceAttributeValueResponse,
    })
    serviceAttributeValues!: Array<ServiceAttributeValueResponse>;
}
