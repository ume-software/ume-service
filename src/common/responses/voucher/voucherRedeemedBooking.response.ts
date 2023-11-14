import { ApiModel, ApiModelProperty } from "express-swagger-typescript";

@ApiModel({
    description: "Voucher Redeemed Booking Response",
})
export class VoucherRedeemedBookingResponse {
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
        description: "Voucher Id",
        required: true,
        example: "a1da9857-355e-43f1-8fdb-26a8a0ace6bd",
    })
    voucherId!: string;

    @ApiModelProperty({
        description: "Booker Id",
        required: true,
        example: "a1da9857-355e-43f1-8fdb-26a8a0ace6bd",
    })
    bookerId!: string;

    @ApiModelProperty({
        description: "Booking history Id",
        required: true,
        example: "a1da9857-355e-43f1-8fdb-26a8a0ace6bd",
    })
    bookingHistoryId!: string;

    @ApiModelProperty({
        description: "Booking history Id",
        required: true,
        example: 50000,
    })
    totalDiscountValue!: number;

    @ApiModelProperty({
        description: "Booking history Id",
        required: true,
        example: 0,
    })
    totalCashbackValue!: number;
}
