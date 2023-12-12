import { IsArray, IsObject, IsString, IsUUID } from "class-validator";
import {
    ApiModel,
    ApiModelProperty,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import { mappingDataRequest } from "../base";
import { AttachmentRequest } from "./attachments.request";

@ApiModel({
    description: "Create booking complaint request",
})
export class CreateBookingComplaintResponseRequest {
    requesterId!: string;
    @ApiModelProperty({
        description: "Booking Id",
        required: true,
        example: "42ac81c2-1815-45f7-b598-412487161e1f",
        type: SwaggerDefinitionConstant.STRING,
    })
    @IsUUID()
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
                    ]
                )
            );
        }
    }
}
