
import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant } from "express-swagger-typescript";
import { BookingHistoryResponse } from "./bookingHistory.reponse";

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
    })
    content!: string;

    @ApiModelProperty({
        description: "Start 0-5",
        example: 5,
    })
    amountStart!: number;

    @ApiModelProperty({
        type: SwaggerDefinitionConstant.ARRAY,
        itemType: BookingHistoryResponse,
        example: {
            id: "f00ada3a-091b-4b6b-8efc-af2da32cd956",
            createdAt: "2023-05-29T17:23:04.562Z",
            updatedAt: "2023-05-29T17:23:04.562Z",
            deletedAt: null,
            status: "USER_CANCEL",
            acceptedAt: "2023-05-28T23:49:56.469Z",
            bookerId: "2e82b1a6-e878-4bd5-9e08-1fa3d03cd18e",
            providerSkillId: "eaf0d5a6-e305-438d-a78b-72bbb288eec1",
            totalCost: 194,
            bookingPeriod: 1,
            booker: {
                id: "2e82b1a6-e878-4bd5-9e08-1fa3d03cd18e",
                name: "Christine Gutmann",
                slug: "christine-gutmann",
                avatarUrl: "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/123.jpg"
            }
        }
    })
    booking!: Array<BookingHistoryResponse>;

}
