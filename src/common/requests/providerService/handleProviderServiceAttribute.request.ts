import { IsArray, IsUUID } from "class-validator";
import {
    ApiModel,
    ApiModelProperty,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import { mappingDataRequest } from "../base";

@ApiModel({
    description: "Handle Provider Service Attribute Request",
})
export class HandleProviderServiceAttributeRequest {
    @ApiModelProperty({
        description: "Service Attribute Id",
        required: true,
        example: "9fa9f3c5-640a-407f-b64f-12ff6f55e15c",
    })
    @IsUUID()
    id!: string;

    @ApiModelProperty({
        description: "Service Attribute Value Ids",
        required: true,
        example: [
            "9fa9f3c5-640a-407f-b64f-12ff6f55e15c",
            "9fa9f3c5-640a-407f-b64f-12ff6f55e15c",
        ],
        type: SwaggerDefinitionConstant.ARRAY,
        itemType: SwaggerDefinitionConstant.STRING,
    })
    @IsArray()
    handleServiceAttributeValueIds!: Array<string>;

    constructor(data: HandleProviderServiceAttributeRequest) {
        if (data) {
            if (!data.handleServiceAttributeValueIds)
                data.handleServiceAttributeValueIds = [];
            Object.assign(
                this,
                mappingDataRequest(
                    HandleProviderServiceAttributeRequest,
                    data,
                    ["id", "handleServiceAttributeValueIds"]
                )
            );
        }
    }
}
