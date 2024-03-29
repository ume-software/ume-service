import { BookingStatus } from "@prisma/client";
import { ApiModel, ApiModelProperty } from "express-swagger-typescript";
import { UserInformationResponse } from "../user/userInformation.response";
import { ProviderServiceResponse } from "../providerService/providerService.response";
@ApiModel({
    description: "Booking History response",
})
export class BookingHistoryResponse {

    
    @ApiModelProperty({
        description: "Id's provider",
        required: true,
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
        description: "Accepted At",
        example: "2023-05-10T07:08:46.083Z",
    })
    acceptedAt!: Date;

    @ApiModelProperty({
        description: "Slug url",
        required: true,
        example: BookingStatus.INIT,
    })
    status!: BookingStatus;

    @ApiModelProperty({
        description: "Id's user booking",
        required: true,
        example: "a1da9857-355e-43f1-8fdb-26a8a0ace6bd",
    })
    bookerId!: string;

    @ApiModelProperty({
        description: "Booker Information",
        required: false,
        model: UserInformationResponse,
    })
    booker?: UserInformationResponse;

    @ApiModelProperty({
        description: "Id's service of provider",
        required: true,
        example: "a1da9857-355e-43f1-8fdb-26a8a0ace6bd",
    })
    providerServiceId!: string;

    @ApiModelProperty({
        description: "Total cost (bookingPeriod * serviceCost)",
        required: false,
        example: 16,
    })
    totalCost?: number;

    @ApiModelProperty({
        description: "Booking period (hours)",
        required: false,
        example: 2,
    })
    bookingPeriod?: number;

    @ApiModelProperty({
        description: "Provider service",
        required: false,
        model: ProviderServiceResponse,
    })
    providerService?: ProviderServiceResponse;

    // @ApiModelProperty({
    //     description: "Feedback",
    //     required: false,
    //     model: FeedbackResponse,
    // })
    // feedback?: FeedbackResponse;
}
