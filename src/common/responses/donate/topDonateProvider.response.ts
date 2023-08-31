import {
  ApiModel,
  ApiModelProperty,
} from "express-swagger-typescript";
import { ProviderResponse } from "../provider";


@ApiModel({
  description: "Top donate provider response",
})
export class TopDonateProviderResponse {


  @ApiModelProperty({
    description: "Total coin donate",
    example: 20,
  })
  actualReceivingAmount!: number;

  @ApiModelProperty({
    description: "Count donate",
    example: 2,
  })
  countActualReceivingAmount!: number;


  @ApiModelProperty({
    description: "Provider id",
    example: "0c261207-3e82-4d56-a261-32175b797a78",
  })
  providerId!: string;


  @ApiModelProperty({
    description: "provider",
    model: ProviderResponse
  })
  provider!: ProviderResponse;
}
