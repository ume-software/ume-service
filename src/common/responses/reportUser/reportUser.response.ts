import {
    ApiModel,
    ApiModelProperty,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import { ReportReasonType } from "@prisma/client";
import { UserInformationResponse } from "../user";

@ApiModel({
    description: "Report User Request",
})
export class ReportUserResponse {
    @ApiModelProperty({
        description: "Reason type",
        required: true,
        example: "a1da9857-355e-43f1-8fdb-26a8a0ace6bd",
        type: SwaggerDefinitionConstant.STRING,
    })
    reportingUserId!: string;

    @ApiModelProperty({
        description: "reportingUser",
        required: false,
        model: UserInformationResponse,
    })
    reportingUser?: UserInformationResponse;

    @ApiModelProperty({
        description: "Reason type",
        required: true,
        example: "a1da9857-355e-43f1-8fdb-26a8a0ace6bd",
        type: SwaggerDefinitionConstant.STRING,
    })
    reportedUserId!: string;

    @ApiModelProperty({
        description: "reportingUser",
        required: false,
        model: UserInformationResponse,
    })
    reportedUser?: UserInformationResponse;

    @ApiModelProperty({
        description: "Reason type",
        required: true,
        enum: Object.values(ReportReasonType),
    })
    reasonType!: ReportReasonType;

    @ApiModelProperty({
        description: "Content",
        required: false,
    })
    content!: string;
}
