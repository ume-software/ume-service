import {
    ApiModel,
    ApiModelProperty,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import { UserInformationResponse } from "../user/userInformation.response";
import { ProviderServiceResponse } from "../providerService/providerService.response";
import { ProviderResponse } from "../provider";
import { VoucherRedeemedBookingResponse } from "../voucher";
@ApiModel({
    description: "Estimate History response",
})
export class EstimateHistoryResponse {
    @ApiModelProperty({
        description: "Provider service",
        required: true,
        model: ProviderServiceResponse,
    })
    providerService?: ProviderServiceResponse;

    @ApiModelProperty({
        description: "Provider information",
        required: true,
        model: ProviderResponse,
    })
    provider?: ProviderResponse;

    @ApiModelProperty({
        description: "Voucher redeemed booking",
        required: true,
        type: SwaggerDefinitionConstant.ARRAY,
        itemType: VoucherRedeemedBookingResponse,
    })
    voucherRedeemedBooking!: Array<VoucherRedeemedBookingResponse>;

    @ApiModelProperty({
        description: "Id's user booking",
        required: true,
        example: "a1da9857-355e-43f1-8fdb-26a8a0ace6bd",
    })
    bookerId!: string;

    @ApiModelProperty({
        description: "Booker Information",
        required: true,
        model: UserInformationResponse,
    })
    booker?: UserInformationResponse;

    @ApiModelProperty({
        description: "Id's service of provider",
        required: true,
        example: "a1da9857-355e-43f1-8fdb-26a8a0ace6bd",
    })
    providerServiceId!: string;

    @ApiModelProperty({
        description: "Real cost per hour of provider service",
        required: true,
        example: 100000,
    })
    costPerHour?: number;

    @ApiModelProperty({
        description: "Booking period",
        required: true,
        example: 5,
    })
    bookingPeriod?: number;

    @ApiModelProperty({
        description:
            "Total cost before using voucher (bookingPeriod * costPerHour)",
        required: true,
        example: 500000,
    })
    totalCostBeforeVoucher?: number;

    @ApiModelProperty({
        description:
            "Total cost need for booking (totalCost - totalDiscountValueByVoucherProvider - totalDiscountValueByVoucherSystem)",
        required: true,
        example: 450000,
    })
    totalCostNeedForBooking?: number;

    @ApiModelProperty({
        description:
            "Total cost spend for booking (totalCostNeedForBooking - totalCashbackValueByVoucherProvider - totalCashbackValueByVoucherSystem",
        required: true,
        example: 400000,
    })
    totalCostSpendBooking?: number;

    @ApiModelProperty({
        description: "Provider received balance",
        required: true,
        example: 495000,
    })
    providerReceivedBalance?: number;

    @ApiModelProperty({
        description: "Total cashback value by voucher provider",
        required: true,
        example: 0,
    })
    totalCashbackValueByVoucherProvider?: number;

    @ApiModelProperty({
        description: "Total cashback value by voucher system",
        required: true,
        example: 50000,
    })
    totalCashbackValueByVoucherSystem?: number;

    @ApiModelProperty({
        description: "Total discount value by voucher provider",
        required: true,
        example: 0,
    })
    totalDiscountValueByVoucherProvider?: number;

    @ApiModelProperty({
        description: "Total discount value by voucher system",
        required: true,
        example: 50000,
    })
    totalDiscountValueByVoucherSystem?: number;
}
