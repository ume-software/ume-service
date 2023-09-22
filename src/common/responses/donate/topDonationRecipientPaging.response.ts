import {
    ApiModel,
    ApiModelProperty,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import { TopDonationRecipientResponse } from "./topDonationRecipient.response";

@ApiModel({
    description: "Top donate recipient response",
})
export class TopDonationRecipientPagingResponse {
    @ApiModelProperty({
        description: "Row",

        type: SwaggerDefinitionConstant.ARRAY,
        itemType: TopDonationRecipientResponse,
    })
    row!: Array<TopDonationRecipientResponse>;
}
