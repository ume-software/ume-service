import { ApiModel, ApiModelProperty } from "express-swagger-typescript";
import { UserInformationResponse } from "../user";

@ApiModel({
    description: "Top donate donor response",
})
export class TopDonationDonorResponse {
    @ApiModelProperty({
        description: "Total coin donate",
        example: 20,
    })
    totalBalanceDonated!: number;

    @ApiModelProperty({
        description: "Count donate",
        example: 2,
    })
    numberDonated!: number;

    @ApiModelProperty({
        description: "Provider id",
        example: "0c261207-3e82-4d56-a261-32175b797a78",
    })
    donorId!: string;

    @ApiModelProperty({
        description: "User",
        model: UserInformationResponse,
    })
    donor!: UserInformationResponse;
}
