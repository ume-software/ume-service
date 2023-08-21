import { BookingStatus } from "@prisma/client";
import { ApiModel, ApiModelProperty } from "express-swagger-typescript";
import { UserInformationResponse } from "./userInformation.response";
import { ProviderSkillResponse } from "./providerSkill.response";

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
        description: "Id's skill of provider",
        required: true,
        example: "a1da9857-355e-43f1-8fdb-26a8a0ace6bd",
    })
    providerSkillId!: string;

    @ApiModelProperty({
        description: "Total cost (bookingPeriod * skillCost)",
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
        description: "Provider skill",
        required: false,
        model: ProviderSkillResponse,
    })
    providerSkill?: ProviderSkillResponse;
}
