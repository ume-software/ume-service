import {
    ApiModel,
    ApiModelProperty,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import { BookingCostResponse } from "../bookingCost/bookingCost.response";
import { ServiceResponse } from "../service";

@ApiModel({
    description: "Admin get provider service response",
})
export class AdminGetProviderServiceResponse {
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
        description: "Provider service name",
        example: "0c261207-3e82-4d56-a261-32175b797a78",
    })
    providerId!: string;

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
        description: "Total coin provider received",
        example: 1074.45,
        type: SwaggerDefinitionConstant.NUMBER,
    })
    totalReceivedCoin!: number;

    @ApiModelProperty({
        description: "Total revenue",
        example: 1131,
        type: SwaggerDefinitionConstant.NUMBER,
    })
    totalRevenue!: number;

    @ApiModelProperty({
        description: "Total booking transaction",
        example: 13,
        type: SwaggerDefinitionConstant.INTEGER,
    })
    totalBooking!: number;

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
}
