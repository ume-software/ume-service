import { ApiModel, ApiModelProperty } from "express-swagger-typescript";
import { UserInformationResponse } from "../user";

@ApiModel({
    description: "Follow response",
})
export class FollowResponse {
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
        description: "Follower id",
        example: "a1da9857-355e-43f1-8fdb-26a8a0ace6bd",
    })
    followerId!: string;

    @ApiModelProperty({
        description: "Follower",
        model: UserInformationResponse,
    })
    follower!: UserInformationResponse;

    @ApiModelProperty({
        description: "Following",
        example: "a1da9857-355e-43f1-8fdb-26a8a0ace6bd",
    })
    followingId!: string;

    @ApiModelProperty({
        description: "Following",
        model: UserInformationResponse,
    })
    following!: UserInformationResponse;
}
