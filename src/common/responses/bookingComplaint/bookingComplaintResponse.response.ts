import { BookingComplaintResponseType } from "@prisma/client";
import {
    ApiModel,
    ApiModelProperty,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import { AttachmentResponse } from "./attechment.response";
@ApiModel({
    description: "Booking complaint response",
})
export class BookingComplaintResponseResponse {
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
        example: null,
    })
    deletedAt!: Date;

    @ApiModelProperty({
        description: "Booking complaint id",
        example: "42ac81c2-1815-45f7-b598-412487161e1f",
    })
    bookingComplaintId!: string;

    @ApiModelProperty({
        description: "Response message",
        example: "Response message",
    })
    responseMessage!: string;

    @ApiModelProperty({
        description: "Booking complaint response type",
        example: BookingComplaintResponseType.ADMIN_SEND_TO_PROVIDER,
        enum: Object.values(BookingComplaintResponseType),
    })
    bookingComplaintResponseType!: BookingComplaintResponseType;

    @ApiModelProperty({
        description: "Attachments",
        type: SwaggerDefinitionConstant.ARRAY,
        itemType: AttachmentResponse,
    })
    attachments!: Array<AttachmentResponse>;
}
