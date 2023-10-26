import {
    ApiModel,
    ApiModelProperty,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import { BookingCostResponse } from "../bookingCost/bookingCost.response";
import { ServiceResponse } from "../service";
import { ProviderServiceAttributeResponse } from "./providerServiceAttribute.response";
@ApiModel({
    description: "Provider service response",
})
export class ProviderServiceResponse {
    @ApiModelProperty({
        description: "Id's provider",
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
        description: "Provider Id",
        example: "0c261207-3e82-4d56-a261-32175b797a78",
    })
    providerId!: string;

    @ApiModelProperty({
        description: "Provider",
    })
    provider!: any;

    @ApiModelProperty({
        description: "Service id",
        example: "4624fdb2-3d58-4112-b3e4-f86fda9a833f",
    })
    serviceId!: string;

    @ApiModelProperty({
        description: "Default cost",
        example: 10,
    })
    defaultCost!: number;

    @ApiModelProperty({
        description: "Position",
        example: 1,
    })
    position!: number;

    @ApiModelProperty({
        description: "Description about provider service",
        example: "This is description",
    })
    description!: string;

    @ApiModelProperty({
        description: "Position",
        type: SwaggerDefinitionConstant.ARRAY,
        itemType: BookingCostResponse,
    })
    bookingCosts!: Array<BookingCostResponse>;

    @ApiModelProperty({
        description: "Service",
        model: ServiceResponse,
    })
    service!: ServiceResponse;

    @ApiModelProperty({
        description: "providerServiceAttributes",
        type: SwaggerDefinitionConstant.ARRAY,
        itemType: ProviderServiceAttributeResponse,
    })
    providerServiceAttributes!: Array<ProviderServiceAttributeResponse>;
}
