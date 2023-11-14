import { DepositRequestStatus, UnitCurrency } from "@prisma/client";
import { ApiModel, ApiModelProperty } from "express-swagger-typescript";
import { AdminInformationResponse } from "../admin";
import { UserInformationResponse } from "../user";
import { UserPaymentSystemResponse } from "../userPaymentSystem";

@ApiModel({
    description: "Withdrawal Request Response",
})
export class WithdrawalRequestResponse {
    @ApiModelProperty({
        description: "Id's provider",
        required: true,
        example: "a1da9857-355e-43f1-8fdb-26a8a0ace6bd",
    })
    id!: string;

    @ApiModelProperty({
        description: "Created At",
        required: true,
        example: "2023-05-10T07:08:46.083Z",
    })
    createdAt!: Date;

    @ApiModelProperty({
        description: "Update At",
        required: true,
        example: "2023-05-10T07:08:46.083Z",
    })
    updatedAt!: Date;

    @ApiModelProperty({
        description: "Deleted At",
        required: false,
        example: "2023-05-10T07:08:46.083Z",
    })
    deletedAt!: Date;

    @ApiModelProperty({
        description: "Amount money",
        required: true,
        example: 30030,
    })
    amountMoney!: number;

    @ApiModelProperty({
        description: "Amount balance",
        required: true,
        example: 30,
    })
    amountBalance!: number;

    @ApiModelProperty({
        description: "Unit currency",
        required: true,
        enum: Object.values(UnitCurrency),
        example: UnitCurrency.VND,
    })
    unitCurrency!: UnitCurrency;

    @ApiModelProperty({
        description: "Requester id",
        required: true,
        example: "1f0095c1-4795-4c77-b1f7-b5778501c77c",
    })
    requesterId!: string;
    @ApiModelProperty({
        description: "Requester",
        required: false,
        model: UserInformationResponse,
    })
    requester?: UserInformationResponse;
    @ApiModelProperty({
        description: "Coin history Id",
        required: false,
        example: "3646a0ae-494a-4cef-876c-1f578c3d6b8d",
    })
    balanceHistoryId?: string;

    @ApiModelProperty({
        description: "Status",
        required: true,
        enum: Object.values(DepositRequestStatus),
        example: DepositRequestStatus.INIT,
    })
    status!: DepositRequestStatus;

    @ApiModelProperty({
        description: "Handler id (admin)",
        required: true,
        example: "3646a0ae-494a-4cef-876c-1f578c3d6b8f",
    })
    handlerId!: string;
    @ApiModelProperty({
        description: "Handler (admin)",
        required: false,
        model: AdminInformationResponse,
    })
    handler?: AdminInformationResponse;

    @ApiModelProperty({
        description: "Handler feedback",
        required: false,
        example: "Done",
    })
    handlerFeedback?: string;

    @ApiModelProperty({
        description: "Bill image url",
        required: false,
        example: "url",
    })
    billImageUrl?: string;
    @ApiModelProperty({
        description: "userPaymentSystem Id",
        required: true,
        example: "3646a0ae-494a-4cef-876c-1f578c3d6b8f",
    })
    userPaymentSystemId!: string;

    @ApiModelProperty({
        description: "userPaymentSystem",
        required: true,
        example: "3646a0ae-494a-4cef-876c-1f578c3d6b8f",
        model: UserPaymentSystemResponse,
    })
    userPaymentSystem!: UserPaymentSystemResponse;
}
