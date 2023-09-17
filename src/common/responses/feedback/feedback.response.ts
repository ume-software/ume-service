import {
    ApiModel,
    ApiModelProperty,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import { BookingHistoryResponse } from "../booking/bookingHistory.response";

@ApiModel({
    description: "Feedback response",
})
export class FeedbackResponse {
    @ApiModelProperty({
        description: "Id's provider",
        required: true,
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
        example: "2023-05-10T07:08:46.083Z",
    })
    deletedAt!: Date;

    @ApiModelProperty({
        description: "Accepted At",
        example: "2023-05-10T07:08:46.083Z",
    })
    acceptedAt!: Date;

    @ApiModelProperty({
        description: "Content feedback",
        example: "Good job",
        required: false,
    })
    content!: string;

    @ApiModelProperty({
        description: "Start 0-5",
        example: 5,
        type: SwaggerDefinitionConstant.INTEGER,
    })
    amountStar!: number;

    @ApiModelProperty({
        description: "Booking",
        model: BookingHistoryResponse,
    })
    booking!: BookingHistoryResponse;
}
