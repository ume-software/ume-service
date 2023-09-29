import {
    ApiModel,
    ApiModelProperty,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import { mappingDataRequest } from "../base";
import { IsOptional, IsString } from "class-validator";
import { UserKYCStatus } from "@prisma/client";

@ApiModel({
    description: "Admin ban request",
})
export class AdminHandleUserKYCRequestRequest {
    adminId!: string;
    id!: string;
    userKYCStatus!: UserKYCStatus;
    @ApiModelProperty({
        description: "Content",
        required: false,
        example: "Good job",
        type: SwaggerDefinitionConstant.STRING,
    })
    @IsOptional()
    @IsString()
    content?: string;

    constructor(data: AdminHandleUserKYCRequestRequest) {
        if (data) {
            Object.assign(
                this,
                mappingDataRequest(AdminHandleUserKYCRequestRequest, data, [
                    "content",
                    "userKYCStatus",
                    "id",
                    "adminId",
                ])
            );
        }
    }
}
