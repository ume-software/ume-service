import { BalanceType } from "@prisma/client";
import { ApiModel, ApiModelProperty } from "express-swagger-typescript";
import { BookingHistoryResponse } from "../booking";
import { DonationResponse } from "../donation/donation.response";

@ApiModel({
    description: "Balance History response",
})
export class BalanceHistoryResponse {
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
        example: null,
    })
    deletedAt!: Date;

    @ApiModelProperty({
        description: "Id's user",
        required: true,
        example: "a1da9857-355e-43f1-8fdb-26a8a0ace6bd",
    })
    userId!: string;

    @ApiModelProperty({
        description: "Slug url",
        required: true,
        enum: Object.values(BalanceType),
        example: BalanceType.DEPOSIT,
    })
    coinType!: BalanceType;

    @ApiModelProperty({
        description: "Amount",
        required: true,
        example: 10,
    })
    amount!: number;

    @ApiModelProperty({
        description: "Id of creator this history",
        required: false,
        example: "a1da9857-355e-43f1-8fdb-26a8a0ace6bd",
    })
    adminIdCreated?: string;

    @ApiModelProperty({
        description: "Id of booiking this history",
        required: false,
        example: "a1da9857-355e-43f1-8fdb-26a8a0ace6bd",
    })
    bookingId?: string;

    @ApiModelProperty({
        description: "Id of booiking this history",
        required: false,
        example: "a1da9857-355e-43f1-8fdb-26a8a0ace6bd",
        model: BookingHistoryResponse,
    })
    booking?: BookingHistoryResponse;

    @ApiModelProperty({
        description: "Id of donation this history",
        required: false,
        example: "a1da9857-355e-43f1-8fdb-26a8a0ace6bd",
    })
    donationId?: string;

    @ApiModelProperty({
        description: "Donation",
        required: false,
        model: DonationResponse,
    })
    donation?: DonationResponse;
}
