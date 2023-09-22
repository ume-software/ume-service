import { ApiModel, ApiModelProperty } from "express-swagger-typescript";
import { UserInformationResponse } from "../user";

@ApiModel({
    description: "Top donate provider response",
})
export class TopDonationRecipientResponse {
    @ApiModelProperty({
        description: "Total coin donate",
        example: 20,
    })
    totalReceivedAmount!: number;

    @ApiModelProperty({
        description: "Count donate",
        example: 2,
    })
    numberDonationsReceived!: number;

    @ApiModelProperty({
        description: "User id",
        example: "0c261207-3e82-4d56-a261-32175b797a78",
    })
    recipientId!: string;

    @ApiModelProperty({
        description: "User information",
        model: UserInformationResponse,
    })
    recipient!: UserInformationResponse;
}
