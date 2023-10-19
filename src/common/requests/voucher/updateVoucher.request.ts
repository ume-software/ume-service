import {
    DiscountUnit,
    VoucherRecipientType,
    VoucherStatus,
    VoucherType,
} from "@prisma/client";
import { Type } from "class-transformer";
import {
    IsArray,
    IsBoolean,
    IsDate,
    IsEnum,
    IsInt,
    IsOptional,
    IsString,
    IsUrl,
    Min,
} from "class-validator";
import {
    ApiModel,
    ApiModelProperty,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";
import { mappingDataRequest } from "../base";

@ApiModel({
    description: "Create voucher request",
})
export class UpdateVoucherRequest {
    id!: string;
    providerId?: string;
    adminId?: string;
    provider?: any;
    admin?: any;
    isPublished?: boolean;
    @ApiModelProperty({
        description: "A URL pointing to an image associated with the voucher.",
        required: false,
        example:
            "https://cdn.pixabay.com/photo/2020/05/11/22/31/cat-5160456_960_720.png",
    })
    @IsOptional()
    @IsUrl()
    image?: string;

    @ApiModelProperty({
        description: "A description or message associated with the voucher.",
        required: false,
        example: "Get 25% off on your summer bookings!",
    })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiModelProperty({
        description: "A short description of the voucher.",
        required: false,
        example: "Summer Discount Voucher",
    })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiModelProperty({
        description: "The total number of vouchers issued.",
        required: false,
        example: 1000,
    })
    @IsOptional()
    @Min(1)
    @IsInt()
    numberIssued?: number;

    @ApiModelProperty({
        description:
            "The maximum number of vouchers that can be issued per day.",
        required: false,
        example: 50,
    })
    @IsOptional()
    @Min(1)
    @IsInt()
    dailyNumberIssued?: number;

    @ApiModelProperty({
        description:
            "The maximum number of vouchers that a single user can use.",
        required: false,
        example: 1,
    })
    @IsOptional()
    @Min(1)
    @IsInt()
    numberUsablePerBooker?: number;

    @ApiModelProperty({
        description: " The maximum number of vouchers a user can use in a day.",
        required: false,
        example: 1,
    })
    @IsOptional()
    @Min(1)
    @IsInt()
    dailyUsageLimitPerBooker?: number;

    @ApiModelProperty({
        description: 'The type of the voucher, like "DISCOUNT" in this case.',
        required: false,
        enum: Object.values(VoucherType),
        example: VoucherType.DISCOUNT,
    })
    @IsOptional()
    @IsEnum(VoucherType)
    type?: VoucherType;

    @ApiModelProperty({
        description:
            'The unit of discount, such as "PERCENT" or other options.',
        required: false,
        example: DiscountUnit.PERCENT,
        enum: Object.values(DiscountUnit),
    })
    @IsOptional()
    @IsEnum(DiscountUnit)
    discountUnit?: DiscountUnit;

    @ApiModelProperty({
        description: "The value of the discount (e.g., 25 for a 25% discount).",
        required: false,
        example: 25,
    })
    @IsOptional()
    @Min(1)
    @IsInt()
    discountValue?: number;

    @ApiModelProperty({
        description: "The maximum value that the discount can reach.",
        required: false,
        example: 100,
    })
    @IsOptional()
    @Min(1)
    @IsInt()
    maximumDiscountValue?: number;

    @ApiModelProperty({
        description:
            "The minimum total booking price required for the voucher to be usable.",
        required: false,
        example: 120,
    })
    @IsOptional()
    @Min(1)
    @IsInt()
    minimumBookingTotalPriceForUsage?: number;

    @ApiModelProperty({
        description:
            "The minimum duration of booking for the voucher to be usable.",
        required: false,
        example: 2,
    })
    @IsOptional()
    @Min(1)
    @IsInt()
    minimumBookingDurationForUsage?: number;

    @ApiModelProperty({
        description: " The starting date when the voucher can be used.",
        required: false,
        example: "2023-09-01T00:00:00Z",
    })
    @Type(() => Date)
    @IsOptional()
    @IsDate()
    startDate?: Date;

    @ApiModelProperty({
        description:
            "The ending date after which the voucher is no longer valid.",
        required: false,
        example: "2023-10-01T00:00:00Z",
    })
    @Type(() => Date)
    @IsOptional()
    @IsDate()
    endDate?: Date;

    @ApiModelProperty({
        description:
            "An array of integers (1 to 7) representing the days of the week when the voucher can be used.",
        required: false,
        example: [1, 2, 3, 4, 5],
        type: SwaggerDefinitionConstant.ARRAY,
        itemType: SwaggerDefinitionConstant.INTEGER,
    })
    @IsOptional()
    @IsArray()
    @IsInt({ each: true })
    applyISODayOfWeek?: Array<number>;

    @ApiModelProperty({
        description:
            'The type of recipients the voucher is meant for, like "ALL".',
        required: false,
        enum: Object.values(VoucherRecipientType),
        example: VoucherRecipientType.ALL,
    })
    @IsOptional()
    @IsEnum(VoucherRecipientType)
    recipientType?: VoucherRecipientType;

    @ApiModelProperty({
        description:
            " An array of user IDs for selective recipients of the voucher.",
        required: false,
        example: [],
        type: SwaggerDefinitionConstant.ARRAY,
        itemType: SwaggerDefinitionConstant.STRING,
    })
    @IsOptional()
    @IsString({ each: true })
    @IsArray()
    selectiveBookerIds?: Array<string>;

    @ApiModelProperty({
        description: " A boolean indicating whether the voucher is hidden.",
        required: false,
        example: false,
    })
    @IsOptional()
    @IsBoolean()
    isHided?: boolean;

    @ApiModelProperty({
        description: "Voucher status.",
        required: false,
        example: false,
    })
    @IsOptional()
    @IsEnum(VoucherStatus)
    status?: VoucherStatus;

    @ApiModelProperty({
        description: " A boolean indicating whether the voucher is activated.",
        required: false,
        example: false,
    })
    @IsOptional()
    @IsBoolean()
    isActivated?: boolean;
    constructor(data: UpdateVoucherRequest) {
        if (data) {
            Object.assign(
                this,
                mappingDataRequest(UpdateVoucherRequest, data, [
                    "applyISODayOfWeek",
                    "name",
                    "dailyUsageLimitPerBooker",
                    "description",
                    "discountUnit",
                    "discountValue",
                    "endDate",
                    "image",
                    "isActivated",
                    "isHided",
                    "maximumDiscountValue",
                    "minimumBookingDurationForUsage",
                    "minimumBookingTotalPriceForUsage",
                    "numberIssued",
                    "numberUsablePerBooker",
                    "recipientType",
                    "selectiveBookerIds",
                    "startDate",
                    "type",
                    "status",
                    "isActivated",
                    "dailyNumberIssued",
                ])
            );
        }
    }
}
