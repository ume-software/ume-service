import {
    ApiModel,
    ApiModelProperty,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import { InstantCardHashTagResponse } from "./instantCardHashTag.response";
import { UserInformationResponse } from "../user";

@ApiModel({
    description: "Instant card response",
})
export class InstantCardResponse {
    @ApiModelProperty({
        description: "Id's notice post",
        required: true,
        example: "a1da9857-355e-43f1-8fdb-26a8a0ace6bd",
        type: SwaggerDefinitionConstant.STRING,
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
        type: SwaggerDefinitionConstant.STRING,
    })
    userId!: string;

    @ApiModelProperty({
        description: "User Info",
        required: false,
        model: UserInformationResponse,
    })
    user?: UserInformationResponse;

    @ApiModelProperty({
        description: "Content",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
    })
    content!: string;

    @ApiModelProperty({
        description: "Gradient colors",
        required: true,
        type: SwaggerDefinitionConstant.STRING,
    })
    gradientColors!: string;

    @ApiModelProperty({
        description: "Instant card hash tags",
        required: true,
        type: SwaggerDefinitionConstant.ARRAY,
        itemType: InstantCardHashTagResponse,
    })
    instantCardHashTags!: Array<InstantCardHashTagResponse>;
}
