import { IsEnum, IsObject } from "class-validator";
import { ApiModel, ApiModelProperty } from "express-swagger-typescript";
import { mappingDataRequest } from "../base";
import { BookingComplaintStatus } from "@prisma/client";
import { CreateBookingComplaintResponseRequest } from "./createBookingComplaintResponse.request";

@ApiModel({
    description: "Create booking complaint request",
})
export class AdminHandleBookingComplaintRequest {
    
    id!: string;
    @ApiModelProperty({
        description: "Booking complaint status",
        required: true,
        enum: Object.values(BookingComplaintStatus),
    })
    @IsEnum(BookingComplaintStatus)
    bookingComplaintStatus!: BookingComplaintStatus;

    @ApiModelProperty({
        description: "booking complaint response request",
        required: true,
        model: CreateBookingComplaintResponseRequest,
    })
    @IsObject()
    bookingComplaintResponseRequest?: CreateBookingComplaintResponseRequest;

    constructor(data: AdminHandleBookingComplaintRequest) {
        if (data) {
            Object.assign(
                this,
                mappingDataRequest(AdminHandleBookingComplaintRequest, data, [
                    "id",
                    "bookingComplaintStatus",
                    "bookingComplaintResponseRequest",
                ])
            );
        }
    }
}
