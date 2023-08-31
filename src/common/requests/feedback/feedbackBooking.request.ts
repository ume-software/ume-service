import {
    ApiModel,
    ApiModelProperty,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";

@ApiModel({
    description: "Feedback booking request",
})
export class FeedbackBookingRequest {
    bookingId!: string;

    bookerId!: string;

    @ApiModelProperty({
        description: "content",
        required: true,
        example: "Good job",
    })
    content!: string;

    @ApiModelProperty({
        description: "Amount Star",
        required: false,
        example: 5,
        itemType: SwaggerDefinitionConstant.NUMBER,
    })
    amountStar!: number;

    constructor(data: FeedbackBookingRequest) {
        this.content = data.content;
        this.amountStar = data.amountStar;
    }
}
