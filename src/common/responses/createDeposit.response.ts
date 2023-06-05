
import { DepositRequestStatus, PaymentSystemPlatform, UnitCurrency } from "@prisma/client";
import { ApiModel, ApiModelProperty } from "express-swagger-typescript";

@ApiModel({
    description: 'Get Qr Deposit response'
})
export class CreateDepositResponse {
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
        description: "Amount coin",
        required: true,
        example: 30,
    })
    amountCoin!: number;

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
        description: "QR string",
        required: true,
        example: "2|99|0947875625|Đỗ Trần Minh Chu||0|0|30030|HMJXXU19J605062023 - 1f0095c1-4795-4c77-b1f7-b5778501c77c|transfer_myqr",
    })
    qrString!: string;

    @ApiModelProperty({
        description: "Coin history Id",
        required: false,
        example: "3646a0ae-494a-4cef-876c-1f578c3d6b8d"
    })
    coinHistoryId?: string;

    @ApiModelProperty({
        description: "Status",
        required: true,
        enum: Object.values(DepositRequestStatus),
        example: DepositRequestStatus.INIT
    })
    status!: DepositRequestStatus;


    @ApiModelProperty({
        description: "Hander id (admin)",
        required: true,
        example: "3646a0ae-494a-4cef-876c-1f578c3d6b8f"
    })
    handlerId!: string;

    @ApiModelProperty({
        description: "Handler feeback",
        required: false,
        example: "Done"
    })
    handlerFeeback?: string;

    @ApiModelProperty({
        description: "Bill image url",
        required: false,
        example: "url"
    })
    billImageUrl?: string;


    @ApiModelProperty({
        description: "Platform",
        required: true,
        enum: Object.values(PaymentSystemPlatform),
        example: PaymentSystemPlatform.MOMO
    })
    platform!: PaymentSystemPlatform;

    @ApiModelProperty({
        description: "Transaction code",
        required: true,
        example: "HMJXXU19J605062023"
    })
    transactionCode!: string;

    @ApiModelProperty({
        description: "Content",
        required: true,
        example: "HMJXXU19J605062023 - 1f0095c1-4795-4c77-b1f7-b5778501c77c"

    })
    content!: string;

}

