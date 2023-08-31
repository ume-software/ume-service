
import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant } from "express-swagger-typescript";
import { FeedbackResponse } from "./feedback.response";
import { PaginationResponse } from "../base";

@ApiModel({
    description: "Feedback paging response",
})
export class FeedbackPagingResponse {
    @ApiModelProperty({
        description: "Row",
        example: [
            {
                id: "07e67962-76fb-49e4-b6da-d19fa9306593",
                createdAt: "2023-05-29T17:23:05.821Z",
                updatedAt: "2023-05-29T17:23:05.821Z",
                deletedAt: null,
                bookingId: "f00ada3a-091b-4b6b-8efc-af2da32cd956",
                content: "Pariatur quaerat ea porro illum modi dolore inventore non repellat. Exercitationem id possimus necessitatibus. Velit animi quo dolores provident sed.",
                amountStar: 1,
                booking: {
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
                    bookerInformation: {
                        id: "2e82b1a6-e878-4bd5-9e08-1fa3d03cd18e",
                        name: "Christine Gutmann",
                        slug: "christine-gutmann",
                        avatarUrl: "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/123.jpg"
                    }
                }
            },
            {
                id: "1deb98e3-1676-48ce-b12d-07b6352a982b",
                createdAt: "2023-05-29T17:23:05.944Z",
                updatedAt: "2023-05-29T17:23:05.944Z",
                deletedAt: null,
                bookingId: "5e5930ef-f309-4d28-b87a-d4b9bd2c1599",
                content: "Repellendus iusto velit fugiat saepe harum enim quae. Soluta sapiente iste nulla. Pariatur voluptatibus et ullam placeat itaque perferendis natus praesentium dolor.",
                amountStar: 5,
                booking: {
                    id: "5e5930ef-f309-4d28-b87a-d4b9bd2c1599",
                    createdAt: "2023-05-29T17:23:04.727Z",
                    updatedAt: "2023-05-29T17:23:04.727Z",
                    deletedAt: null,
                    status: "USER_FINISH_SOON",
                    acceptedAt: "2023-05-28T21:22:34.378Z",
                    bookerId: "2e82b1a6-e878-4bd5-9e08-1fa3d03cd18e",
                    providerSkillId: "eaf0d5a6-e305-438d-a78b-72bbb288eec1",
                    totalCost: 160,
                    bookingPeriod: 9,
                    booker: {
                        id: "2e82b1a6-e878-4bd5-9e08-1fa3d03cd18e",
                        name: "Christine Gutmann",
                        slug: "christine-gutmann",
                        avatarUrl: "https://cloudflare-ipfs.com/ipfs/Qmd3W5DuhgHirLHGVixi6V76LhCkZUz6pnFt5AJBiyvHye/avatar/123.jpg"
                    }
                }
            }
        ],
        type: SwaggerDefinitionConstant.ARRAY,
        itemType: FeedbackResponse,
    })
    row!: Array<FeedbackResponse>;

    @ApiModelProperty({
        description: "Count",
        example: 100,
    })
    count!: number;

    @ApiModelProperty({
        description: "Pagination",
        example: {
            currentPage: 2,
            nextPage: 3,
            prevPage: 1,
            limit: 2,
        },
        model: PaginationResponse,
    })
    pagination!: PaginationResponse;
}
