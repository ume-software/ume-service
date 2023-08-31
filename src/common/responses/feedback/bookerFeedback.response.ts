import { ApiModel, ApiModelProperty } from "express-swagger-typescript";

@ApiModel({
    description: "Booker feedback response",
})
export class BookerFeedbackResponse {
    @ApiModelProperty({
        description: "Id",
        required: true,
        example: "42ac81c2-1815-45f7-b598-412487161e1f",
    })
    id!: string;

    @ApiModelProperty({
        description: "User name",
        required: true,
        example: "Đỗ Trần Minh Chu",
    })
    name!: string;

    @ApiModelProperty({
        description: "Dob timezone 0",
        required: true,
        example: "2001-10-12 17:00:00.000",
    })
    dob!: string;

    @ApiModelProperty({
        description: "Gender",
        required: true,
        example: "MALE",
    })
    gender!: string;


    @ApiModelProperty({
        description: "Avatar",
        required: true,
        example: "https://haycafe.vn/wp-content/uploads/2022/02/anh-meo-cute-hinh-cute-meo.jpg",
    })
    avatar!: string;
}
