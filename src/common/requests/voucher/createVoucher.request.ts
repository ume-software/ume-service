import {
    DiscountUnit,
    VoucherRecipientType,
    VoucherType,
} from "@prisma/client";
import {
    ApiModel,
    ApiModelProperty,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";

@ApiModel({
    description: "Create voucher request",
})
export class CreateVoucherRequest {
    @ApiModelProperty({
        description:
            " A unique string representing the voucher code that users can enter to redeem the voucher.",
        required: false,
        example: "SUPPERSALE",
    })
    code?: string;
    @ApiModelProperty({
        description: "A URL pointing to an image associated with the voucher.",
        required: false,
        example:
            "https://cdn.pixabay.com/photo/2020/05/11/22/31/cat-5160456_960_720.png",
    })
    image?: string;
    @ApiModelProperty({
        description: "A description or message associated with the voucher.",
        required: false,
        example: "Get 25% off on your summer bookings!",
    })
    content?: string;
    @ApiModelProperty({
        description: "A short description of the voucher.",
        required: false,
        example: "Summer Discount Voucher",
    })
    description?: string;
    @ApiModelProperty({
        description: "The total number of vouchers issued.",
        required: false,
        example: 1000,
    })
    numberIssued?: number;
    @ApiModelProperty({
        description:
            "The maximum number of vouchers that can be issued per day.",
        required: false,
        example: 50,
    })
    dailyNumberIssued?: number;
    @ApiModelProperty({
        description:
            "The maximum number of vouchers that a single user can use.",
        required: false,
        example: 1,
    })
    numberUsablePerBooker?: number;
    @ApiModelProperty({
        description: " The maximum number of vouchers a user can use in a day.",
        required: false,
        example: 1,
    })
    dailyUsageLimitPerBooker?: number;
    @ApiModelProperty({
        description:
            "A boolean indicating whether the voucher is activated or not.",
        required: false,
        example: true,
    })
    isActivated!: boolean;
    @ApiModelProperty({
        description: 'The type of the voucher, like "DISCOUNT" in this case.',
        required: true,
        enum: Object.values(VoucherType),
        example: VoucherType.DISCOUNT,
    })
    type!: VoucherType;
    @ApiModelProperty({
        description:
            'The unit of discount, such as "PERCENT" or other options.',
        required: true,
        example: DiscountUnit.PERCENT,
        enum: Object.values(DiscountUnit),
    })
    discountUnit!: DiscountUnit;
    @ApiModelProperty({
        description: "The value of the discount (e.g., 25 for a 25% discount).",
        required: false,
        example: 25,
    })
    discountValue?: number;
    @ApiModelProperty({
        description: "The maximum value that the discount can reach.",
        required: false,
        example: 100,
    })
    maximumDiscountValue?: number;
    @ApiModelProperty({
        description:
            "The minimum total booking price required for the voucher to be usable.",
        required: false,
        example: 120,
    })
    minimumBookingTotalPriceForUsage?: number;
    @ApiModelProperty({
        description:
            "The minimum duration of booking for the voucher to be usable.",
        required: false,
        example: 2,
    })
    minimumBookingDurationForUsage?: number;
    @ApiModelProperty({
        description: " The starting date when the voucher can be used.",
        required: false,
        example: "2023-09-01T00:00:00Z",
    })
    startDate?: Date;
    @ApiModelProperty({
        description:
            "The ending date after which the voucher is no longer valid.",
        required: false,
        example: "2023-10-01T00:00:00Z",
    })
    endDate?: Date;
    @ApiModelProperty({
        description:
            "An array of integers (1 to 7) representing the days of the week when the voucher can be used.",
        required: false,
        example: [1, 2, 3, 4, 5],
        type: SwaggerDefinitionConstant.ARRAY,
        itemType: SwaggerDefinitionConstant.INTEGER,
    })
    applyISODayOfWeek?: Array<number>;
    @ApiModelProperty({
        description:
            'The type of recipients the voucher is meant for, like "ALL".',
        required: true,
        enum: Object.values(VoucherRecipientType),
        example: VoucherRecipientType.ALL,
    })
    recipientType!: VoucherRecipientType;
    @ApiModelProperty({
        description:
            " An array of user IDs for selective recipients of the voucher.",
        required: false,
        example: [],
        type: SwaggerDefinitionConstant.ARRAY,
        itemType: SwaggerDefinitionConstant.STRING,
    })
    selectiveBookerIds?: Array<string>;
    @ApiModelProperty({
        description: " A boolean indicating whether the voucher is hidden.",
        required: true,
        example: false,
    })
    isHided!: boolean;
    constructor(data: CreateVoucherRequest) {
        this.applyISODayOfWeek = data.applyISODayOfWeek!;
        this.code = data.code!;
        this.content = data.content!;
        this.dailyUsageLimitPerBooker!;
        this.description = data.description!;
        this.discountUnit = data.discountUnit!;
        this.discountValue = data.discountValue!;
        this.endDate = data.endDate!;
        this.image = data.image!;
        this.isActivated = data.isActivated!;
        this.isHided = data.isHided!;
        this.maximumDiscountValue = data.maximumDiscountValue!;
        this.minimumBookingDurationForUsage =
            data.minimumBookingDurationForUsage!;
        this.minimumBookingTotalPriceForUsage =
            data.minimumBookingTotalPriceForUsage!;
        this.numberIssued = data.numberIssued!;
        this.numberUsablePerBooker = data.numberUsablePerBooker!;
        this.recipientType = data.recipientType!;
        this.selectiveBookerIds = data.selectiveBookerIds!;
        this.startDate = data.startDate!;
        this.type = data.type!;
    }
}
