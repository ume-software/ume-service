import {
    ApiModel,
    ApiModelProperty,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import { TopDonationDonorResponse } from "./topDonationDonor.response";

@ApiModel({
    description: "Top user donate response",
})
export class TopDonationDonorPagingResponse {
    @ApiModelProperty({
        description: "Row",

        type: SwaggerDefinitionConstant.ARRAY,
        itemType: TopDonationDonorResponse,
    })
    row!: Array<TopDonationDonorResponse>;
}
