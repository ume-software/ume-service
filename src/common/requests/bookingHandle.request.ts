import { BookingStatus } from "@prisma/client";
import { ApiModel, ApiModelProperty } from "express-swagger-typescript";

@ApiModel({
    description: "Booking handle provider request",
})
export class BookingHandleRequest {
    @ApiModelProperty({
        description: "Booking history id",
        required: true,
        example: "42ac81c2-1815-45f7-b598-412487161e1f",
    })
    bookingHistoryId!: string;

    @ApiModelProperty({
        description: "Booking status",
        required: true,
        example: BookingStatus.PROVIDER_ACCEPT
    })
    status!: BookingStatus;
}
