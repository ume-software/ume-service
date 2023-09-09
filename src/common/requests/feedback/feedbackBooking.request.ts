import { IsNumber, IsOptional, IsString } from "class-validator";
import {
    ApiModel,
    ApiModelProperty,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import { mappingDataRequest } from "../base";

@ApiModel({
    description: "Feedback booking request",
})
export class FeedbackBookingRequest {
    bookingId!: string;

    bookerId!: string;

    @ApiModelProperty({
        description: "content",
        required: false,
        example: "Good job",
    })
    @IsOptional()
    @IsString()
    content!: string;

    @ApiModelProperty({
        description: "Amount Star",
        required: false,
        example: 5,
        itemType: SwaggerDefinitionConstant.NUMBER,
    })
    @IsOptional()
    @IsNumber()
    amountStar!: number;

    constructor(data: FeedbackBookingRequest) {
        if (data) {
            Object.assign(
                this,
                mappingDataRequest(FeedbackBookingRequest, data, [
                    "content",
                    "amountStar",
                ])
            );
        }
    }
}
