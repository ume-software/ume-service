import { BookingComplaintStatus, BookingComplaintType } from "@prisma/client";
import {
    ApiModel,
    ApiModelProperty,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import { AttachmentResponse } from "./attechment.response";
import { BookingHistoryResponse } from "../booking/bookingHistory.response";
import { BookingComplaintResponseResponse } from "./bookingComplaintResponse.response";
@ApiModel({
    description: "Booking complaint response",
})
export class BookingComplaintResponse {
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
        description: "Provider service id",
        example: "42ac81c2-1815-45f7-b598-412487161e1f",
    })
    bookingHistoryId!: string;

    @ApiModelProperty({
        description: "Complaint description",
        example: "Complaint description",
    })
    complaintDescription!: string;

    @ApiModelProperty({
        description: "Complaint status",
        example: BookingComplaintStatus.PENDING_PROCESSING,
        enum: Object.values(BookingComplaintStatus),
    })
    complaintStatus!: BookingComplaintStatus;

    @ApiModelProperty({
        description: "Complaint type",
        example: BookingComplaintType.FRAUD,
        enum: Object.values(BookingComplaintType),
    })
    complaintType!: BookingComplaintType;

    @ApiModelProperty({
        description: "Attachments",
        type: SwaggerDefinitionConstant.ARRAY,
        itemType: AttachmentResponse,
    })
    attachments!: Array<AttachmentResponse>;

    @ApiModelProperty({
        description: "Booking",
        model: BookingHistoryResponse,
    })
    booking!: BookingHistoryResponse;

    @ApiModelProperty({
        description: "Booking complaint response",
        type: SwaggerDefinitionConstant.ARRAY,
        itemType: BookingComplaintResponseResponse,
    })
    bookingComplaintResponses!: Array<BookingComplaintResponseResponse>;
}
