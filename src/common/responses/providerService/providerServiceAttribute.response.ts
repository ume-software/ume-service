import {
    ApiModel,
    ApiModelProperty,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import { ServiceAttributeResponse } from "../service";
import { ProviderServiceAttributeValueResponse } from "./providerServiceAttributeValue.response";
@ApiModel({
    description: "Provider service attribute response",
})
export class ProviderServiceAttributeResponse {
    @ApiModelProperty({
        description: "Id's Provider service attribute",
        example: "a1da9857-355e-43f1-8fdb-26a8a0ace6bd",
    })
    id!: string;

    @ApiModelProperty({
        description: "Created At",
        example: "2023-05-10T07:08:46.083Z",
    })
    createdAt!: Date;

    @ApiModelProperty({
        description: "Update At",
        example: "2023-05-10T07:08:46.083Z",
    })
    updatedAt!: Date;

    @ApiModelProperty({
        description: "Deleted At",
        example: "2023-05-10T07:08:46.083Z",
    })
    deletedAt!: Date;

    @ApiModelProperty({
        description: "providerServiceId",
        example: "0c261207-3e82-4d56-a261-32175b797a78",
    })
    providerServiceId!: string;

    @ApiModelProperty({
        description: "serviceAttributeId",
        example: "4624fdb2-3d58-4112-b3e4-f86fda9a833f",
    })
    serviceAttributeId!: string;

    @ApiModelProperty({
        description: "Position",
        type: SwaggerDefinitionConstant.ARRAY,
        itemType: ProviderServiceAttributeValueResponse,
    })
    providerServiceAttributeValues!: Array<ProviderServiceAttributeValueResponse>;

    @ApiModelProperty({
        description: "serviceAttribute",
        model: ServiceAttributeResponse,
    })
    serviceAttribute!: ServiceAttributeResponse;
}
