import { IsArray, IsEnum, IsObject, IsString } from "class-validator";
import {
    ApiModel,
    ApiModelProperty,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import { mappingDataRequest } from "../base";
import { AttachmentRequest } from "./attachments.request";
import { BookingComplaintResponseType } from "@prisma/client";

@ApiModel({
    description: "Create booking complaint request",
})
export class CreateBookingComplaintResponseRequest {
    requesterId!: string;

    @ApiModelProperty({
        description: "bookingComplaintId",
        required: true,
        example: "42ac81c2-1815-45f7-b598-412487161e1f",

        type: SwaggerDefinitionConstant.STRING,
    })
    @IsString()
    bookingComplaintId!: string;

    @ApiModelProperty({
        description: "Complaint description",
        required: true,
        example:
            "Perspiciatis ducimus corporis consectetur quia aspernatur nulla aliquid occaecati. Reprehenderit dolorum illum repellendus non necessitatibus modi. Fugiat iste quisquam molestias accusamus consequuntur quisquam eum doloribus.",
        type: SwaggerDefinitionConstant.STRING,
    })
    @IsString()
    responseMessage!: string;

    @ApiModelProperty({
        description: "Attachments",
        required: false,
        type: SwaggerDefinitionConstant.ARRAY,
        itemType: AttachmentRequest,
    })
    @IsArray()
    @IsObject({ each: true })
    attachments?: Array<AttachmentRequest>;

    @ApiModelProperty({
        description: "Booking Complaint responseType",
        required: true,
        example: BookingComplaintResponseType.ADMIN_SEND_TO_BOOKER,
        type: SwaggerDefinitionConstant.STRING,
        enum: Object.values(BookingComplaintResponseType),
    })
    @IsEnum(BookingComplaintResponseType)
    bookingComplaintResponseType!: BookingComplaintResponseType;
    constructor(data: CreateBookingComplaintResponseRequest) {
        if (data) {
            Object.assign(
                this,
                mappingDataRequest(
                    CreateBookingComplaintResponseRequest,
                    data,
                    [
                        "requesterId",
                        "bookingComplaintId",
                        "responseMessage",
                        "attachments",
                        "bookingComplaintResponseType",
                    ]
                )
            );
        }
    }
}
