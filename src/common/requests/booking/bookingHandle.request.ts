import { BookingStatus } from "@prisma/client";
import { IsEnum, IsUUID } from "class-validator";
import { ApiModel, ApiModelProperty } from "express-swagger-typescript";
import { mappingDataRequest } from "../base";

@ApiModel({
    description: "Booking handle provider request",
})
export class BookingHandleRequest {
    @ApiModelProperty({
        description: "Booking history id",
        required: true,
        example: "42ac81c2-1815-45f7-b598-412487161e1f",
    })
    @IsUUID()
    bookingHistoryId!: string;

    @ApiModelProperty({
        description: "Booking status",
        required: true,
        enum: Object.values(BookingStatus),
        example: BookingStatus.PROVIDER_ACCEPT,
    })
    @IsEnum(BookingStatus)
    status!: BookingStatus;

    constructor(data: BookingHandleRequest) {
        if (data) {
            Object.assign(
                this,
                mappingDataRequest(BookingHandleRequest, data, [
                    "bookingHistoryId",
                    "status",
                ])
            );
        }
    }
}
