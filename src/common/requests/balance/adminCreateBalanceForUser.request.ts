import { IsNumber, IsUUID } from "class-validator";
import { ApiModel, ApiModelProperty } from "express-swagger-typescript";
import { mappingDataRequest } from "../base";

@ApiModel({
    description: "User registor become provider",
})
export class BalanceForUserRequest {
    @ApiModelProperty({
        description: "Amount",
        required: true,
        example: 10,
    })
    @IsNumber()
    amount!: number;

    @ApiModelProperty({
        description: "User Id",
        required: true,
        example: "7d8c6f10-3eaf-4173-a7c6-f817ebfa71fa",
    })
    @IsUUID()
    userId!: string;
    constructor(data: BalanceForUserRequest) {
        if (data) {
            Object.assign(
                this,
                mappingDataRequest(BalanceForUserRequest, data, [
                    "amount",
                    "userId",
                ])
            );
        }
    }
}
