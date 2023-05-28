
import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant } from "express-swagger-typescript";
import { BookerFeedbackResponse } from "./bookerFeedback.reponse";

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
        itemType: BookerFeedbackResponse,
        example: [
            {
                id: "cee99f3c-d488-4991-a96f-5a5805987a78",
                name: "Đỗ Trần Minh Chu",
                gender: "MALE",
                avatar: "https://haycafe.vn/wp-content/uploads/2022/02/anh-meo-cute-hinh-cute-meo.jpg"
            },
        ],
    })
    booker!: Array<BookerFeedbackResponse>;

}
