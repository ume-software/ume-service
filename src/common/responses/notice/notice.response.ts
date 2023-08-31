import { ApiModel, ApiModelProperty, SwaggerDefinitionConstant } from "express-swagger-typescript";
import { NoticeType } from "@prisma/client";

@ApiModel({
    description: "Notice response",
})
export class NoticeResponse {
    @ApiModelProperty({
        description: "Id's notice post",
        required: true,
        example: "a1da9857-355e-43f1-8fdb-26a8a0ace6bd",
        type: SwaggerDefinitionConstant.STRING
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
        description: "Id's user",
        required: true,
        example: "a1da9857-355e-43f1-8fdb-26a8a0ace6bd",
        type: SwaggerDefinitionConstant.STRING
    })
    userId!: string;

    @ApiModelProperty({
        description: "Type noice",
        required: true,
        enum: Object.values(NoticeType),
        example: NoticeType.HAVE_BOOKING
    })
    type!: NoticeType;

    @ApiModelProperty({
        description: "Data JSON format",
        required: true,
        type: SwaggerDefinitionConstant.OBJECT,
        example: {}
    })
    data!: any;

    @ApiModelProperty({
        description: "Is readed this notice",
        required: true,
        type: SwaggerDefinitionConstant.BOOLEAN,
        example: false
    })
    isReaded!: boolean;
}
