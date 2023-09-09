import { IsNumber, IsOptional, IsString, IsUUID } from "class-validator";
import {
    ApiModel,
    ApiModelProperty,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import { mappingDataRequest } from "../base";

@ApiModel({
    description: "Donate provider request",
})
export class DonateProviderRequest {
    @ApiModelProperty({
        description: "Provider Id",
        required: true,
        example: "42ac81c2-1815-45f7-b598-412487161e1f",
        type: SwaggerDefinitionConstant.STRING,
    })
    @IsUUID()
    providerId!: string;

    @ApiModelProperty({
        description: "Amount",
        required: true,
        type: SwaggerDefinitionConstant.NUMBER,
    })
    @IsNumber()
    amount!: number;

    @ApiModelProperty({
        description: "Message",
        required: false,
        example:
            "Perspiciatis ducimus corporis consectetur quia aspernatur nulla aliquid occaecati. Reprehenderit dolorum illum repellendus non necessitatibus modi. Fugiat iste quisquam molestias accusamus consequuntur quisquam eum doloribus.",
        type: SwaggerDefinitionConstant.STRING,
    })
    @IsOptional()
    @IsString()
    message?: string;

    constructor(data: DonateProviderRequest) {
        if (data) {
            Object.assign(
                this,
                mappingDataRequest(DonateProviderRequest, data, [
                    "providerId",
                    "amount",
                    "message",
                ])
            );
        }
    }
}
