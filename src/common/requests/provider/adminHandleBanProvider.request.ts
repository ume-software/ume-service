import {
    ApiModel,
    ApiModelProperty,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import { mappingDataRequest } from "../base";
import { IsOptional, IsString } from "class-validator";

@ApiModel({
    description: "Admin ban request",
})
export class AdminHandleBanProviderRequest {
    adminId!: string;
    providerId!: string;
    isBanned!: boolean;
    @ApiModelProperty({
        description: "Content",
        required: false,
        example: "Ban acc",
        type: SwaggerDefinitionConstant.STRING,
    })
    @IsOptional()
    @IsString()
    content?: string;

    constructor(data: AdminHandleBanProviderRequest) {
        if (data) {
            Object.assign(
                this,
                mappingDataRequest(AdminHandleBanProviderRequest, data, [
                    "content",
                    "adminId",
                    "providerId",
                    "isBanned",
                ])
            );
        }
    }
}
