import { IsArray, IsEnum, IsObject, IsString, IsUUID } from "class-validator";
import {
    ApiModel,
    ApiModelProperty,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import { mappingDataRequest } from "../base";
import { BookingComplaintType } from "@prisma/client";
import { AttachmentRequest } from "./attachments.request";

@ApiModel({
    description: "Create booking complaint request",
})
export class CreateBookingComplaintRequest {
    bookerId!: string;
    @ApiModelProperty({
        description: "Booking Id",
        required: true,
        example: "42ac81c2-1815-45f7-b598-412487161e1f",
        type: SwaggerDefinitionConstant.STRING,
    })
    @IsUUID()
    bookingId!: string;

    @ApiModelProperty({
        description: "Complaint description",
        required: true,
        example:
            "Perspiciatis ducimus corporis consectetur quia aspernatur nulla aliquid occaecati. Reprehenderit dolorum illum repellendus non necessitatibus modi. Fugiat iste quisquam molestias accusamus consequuntur quisquam eum doloribus.",
        type: SwaggerDefinitionConstant.STRING,
    })
    @IsString()
    complaintDescription!: string;

    @ApiModelProperty({
        description: "Complaint type",
        required: true,
        example: BookingComplaintType.FRAUD,
        type: SwaggerDefinitionConstant.STRING,
        enum: Object.values(BookingComplaintType),
    })
    @IsEnum(BookingComplaintType)
    complaintType!: BookingComplaintType;

    @ApiModelProperty({
        description: "Attachments",
        required: true,
        type: SwaggerDefinitionConstant.ARRAY,
        itemType: AttachmentRequest,
    })
    @IsArray()
    @IsObject({ each: true })
    attachments!: Array<AttachmentRequest>;

    constructor(data: CreateBookingComplaintRequest) {
        if (data) {
            Object.assign(
                this,
                mappingDataRequest(CreateBookingComplaintRequest, data, [
                    "bookerId",
                    "bookingId",
                    "complaintDescription",
                    "complaintType",
                    "attachments",
                ])
            );
        }
    }
}
