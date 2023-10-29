import { IsEnum, IsString } from "class-validator";
import { ApiModel, ApiModelProperty } from "express-swagger-typescript";
import { mappingDataRequest } from "../base";
import { ReportReasonType } from "@prisma/client";

@ApiModel({
    description: "Create Report User Request",
})
export class CreateReportUserRequest {
    @IsString()
    reportedUserSlug!: string;

    @ApiModelProperty({
        description: "Reason type",
        required: true,
        enum: Object.values(ReportReasonType),
    })
    @IsEnum(ReportReasonType)
    reasonType!: ReportReasonType;

    @ApiModelProperty({
        description: "Content",
        required: false,
    })
    @IsString()
    content!: string;
    constructor(data: CreateReportUserRequest) {
        if (data) {
            Object.assign(
                this,
                mappingDataRequest(CreateReportUserRequest, data, [
                    "reportedUserSlug",
                    "reasonType",
                    "content",
                ])
            );
        }
    }
}
