import { ApiModel, ApiModelProperty } from "express-swagger-typescript";
import { UserInformationResponse } from "../user";

@ApiModel({
    description: "Donation response",
})
export class DonationResponse {
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
        example: null,
    })
    deletedAt!: Date;

    @ApiModelProperty({
        description: "Count donate",
        example: 2,
    })
    donatedAmount!: number;

    @ApiModelProperty({
        description: "Donor id",
        example: "0c261207-3e82-4d56-a261-32175b797a78",
    })
    donorId!: string;

    @ApiModelProperty({
        description: "donor",
        model: UserInformationResponse,
    })
    donor!: UserInformationResponse;

    @ApiModelProperty({
        description: "Recipient id",
        example: "0c261207-3e82-4d56-a261-32175b797a78",
    })
    recipientId!: string;

    @ApiModelProperty({
        description: "recipient",
        model: UserInformationResponse,
    })
    recipient!: UserInformationResponse;
}
