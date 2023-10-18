import {
    ApiModel,
    ApiModelProperty,
} from "express-swagger-typescript";
import {
    ServiceAttributeValueResponse,
} from "../service";
@ApiModel({
    description: "Provider service attribute value response",
})
export class ProviderServiceAttributeValueResponse {
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
        description: "providerServiceAttributeId",
        example: "0c261207-3e82-4d56-a261-32175b797a78",
    })
    providerServiceAttributeId!: string;

    @ApiModelProperty({
        description: "serviceAttributeValueId",
        example: "4624fdb2-3d58-4112-b3e4-f86fda9a833f",
    })
    serviceAttributeValueId!: string;

    @ApiModelProperty({
        description: "serviceAttribute",
        model: ServiceAttributeValueResponse,
    })
    serviceAttributeValue!: ServiceAttributeValueResponse;
}
