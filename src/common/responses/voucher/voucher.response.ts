import {
    DiscountUnit,
    VoucherRecipientType,
    VoucherStatus,
    VoucherType,
} from "@prisma/client";
import {
    ApiModel,
    ApiModelProperty,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import { ProviderResponse } from "../provider";
import { AdminResponse } from "../admin";

@ApiModel({
    description: "Create voucher request",
})
export class VoucherResponse {
    @ApiModelProperty({
        description: "Id's provider",
        required: true,
        example: "a1da9857-355e-43f1-8fdb-26a8a0ace6bd",
    })
    id!: string;

    @ApiModelProperty({
        description: "Created At",
        example: "2023-05-10T07:08:46.083Z",
    })
    createdAt!: Date;

    @ApiModelProperty({
        description: "Update At",
        example: "2023-05-10T07:08:46.083Z",
    })
    updatedAt!: Date;

    @ApiModelProperty({
        description: "Deleted At",
        example: null,
    })
    deletedAt!: Date;

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
    name?: string;

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
        description:
            "A boolean indicating whether the voucher is published or not.",
        required: true,
        example: true,
    })
    isPublished!: boolean;

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

    @ApiModelProperty({
        description: "Provider id.",
        required: false,
        example: "a1da9857-355e-43f1-8fdb-26a8a0ace6bd",
        type: SwaggerDefinitionConstant.STRING,
    })
    providerId?: string;

    @ApiModelProperty({
        description: "Admin id.",
        required: false,
        example: "a1da9857-355e-43f1-8fdb-26a8a0ace6bd",
        type: SwaggerDefinitionConstant.STRING,
    })
    adminId?: string;

    @ApiModelProperty({
        description: "Provider",
        required: false,
        model: ProviderResponse,
    })
    provider?: ProviderResponse;

    @ApiModelProperty({
        description: "Admin",
        required: false,
        model: AdminResponse,
    })
    admin?: AdminResponse;

    @ApiModelProperty({
        description: "Voucher status",
        required: true,
        enum: Object.values(VoucherStatus),
    })
    status!: VoucherStatus;
}
