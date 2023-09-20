import {
    DistrictPagingResponse,
    ProvincePagingResponse,
} from "@/common/responses/address";
import {
    BaseController,
    Request,
    Response,
} from "@/controllers/base/base.controller";
import { vietnamAddressService } from "@/services";
import { VietnamAddressService } from "@/services/api/v1/vietnamAddress.service";
import { Prisma } from "@prisma/client";
import {
    ApiOperationGet,
    ApiPath,
    SwaggerDefinitionConstant,
} from "express-swagger-typescript";

@ApiPath({
    path: "/api/v1/vietnam-address",
    name: "VietnamAddress",
})
export class VietnamAddressController extends BaseController {
    constructor() {
        super();
        this.service = vietnamAddressService;
        this.path = "vietnam-address";
        this.customRouting();
    }

    customRouting() {
        this.router.get("/province", this.route(this.getVietnamProvince));
        this.router.get("/district", this.route(this.getVietnamDistrict));
        this.router.get("/commune", this.route(this.getVietnamCommune));
    }
    service: VietnamAddressService;

    @ApiOperationGet({
        path: "/province",
        operationId: "getVietnamProvince",
        description: "Get All Province",
        summary: "Get All Province",
        parameters: {
            query: {
                name: {
                    name: "name",
                    required: false,
                    schema: {
                        type: SwaggerDefinitionConstant.Parameter.Type.STRING,
                    },
                    description: `
                        Example : name=Ho Chi Minh
                        `,
                },
            },
        },
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: ProvincePagingResponse },
                    },
                },
                description: "Filter success",
            },
        },
    })
    async getVietnamProvince(req: Request, res: Response) {
        const { name } = req.query;
        const whereCondition: Prisma.ProvinceWhereInput = {};

        if (name) {
            whereCondition.OR = [
                {
                    name: {
                        contains: name.toString(),
                        mode: "insensitive",
                    },
                },
                {
                    enName: {
                        contains: name.toString(),
                        mode: "insensitive",
                    },
                },
            ];
        }
        const result = await this.service.findAllAndCountProvince({
            where: whereCondition,
        });
        this.onSuccessAsList(res, result);
    }

    @ApiOperationGet({
        path: "/district",
        operationId: "getVietnamDistrict",
        description: "Get All District",
        summary: "Get All District",
        parameters: {
            query: {
                "province-id": {
                    name: "province-id",
                    required: true,
                    schema: {
                        type: SwaggerDefinitionConstant.Parameter.Type.STRING,
                    },
                },
                name: {
                    name: "name",
                    required: false,
                    schema: {
                        type: SwaggerDefinitionConstant.Parameter.Type.STRING,
                    },
                    description: `
                        Example : name=Ho Chi Minh
                        `,
                },
            },
        },
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: DistrictPagingResponse },
                    },
                },
                description: "Filter success",
            },
        },
    })
    async getVietnamDistrict(req: Request, res: Response) {
        const { name } = req.query;
        const whereCondition: Prisma.DistrictWhereInput = {};

        if (req.query["province-id"]) {
            whereCondition.provinceId = req.query["province-id"].toString();
        }
        if (name) {
            whereCondition.OR = [
                {
                    name: {
                        contains: name.toString(),
                        mode: "insensitive",
                    },
                },
                {
                    enName: {
                        contains: name.toString(),
                        mode: "insensitive",
                    },
                },
            ];
        }
        const result = await this.service.findAllAndCountDistrict({
            where: whereCondition,
        });
        this.onSuccessAsList(res, result);
    }

    @ApiOperationGet({
        path: "/commune",
        operationId: "getVietnamCommune",
        description: "Get All Commune",
        summary: "Get All Commune",
        parameters: {
            query: {
                "district-id": {
                    name: "district-id",
                    required: true,
                    schema: {
                        type: SwaggerDefinitionConstant.Parameter.Type.STRING,
                    },
                },
                name: {
                    name: "name",
                    required: false,
                    schema: {
                        type: SwaggerDefinitionConstant.Parameter.Type.STRING,
                    },
                    description: `
                        Example : name=Ho Chi Minh
                        `,
                },
            },
        },
        responses: {
            200: {
                content: {
                    [SwaggerDefinitionConstant.Produce.JSON]: {
                        schema: { model: DistrictPagingResponse },
                    },
                },
                description: "Filter success",
            },
        },
    })
    async getVietnamCommune(req: Request, res: Response) {
        const { name } = req.query;
        const whereCondition: Prisma.CommuneWhereInput = {};

        if (req.query["district-id"]) {
            whereCondition.districtId = req.query["district-id"].toString();
        }
        if (name) {
            whereCondition.OR = [
                {
                    name: {
                        contains: name.toString(),
                        mode: "insensitive",
                    },
                },
                {
                    enName: {
                        contains: name.toString(),
                        mode: "insensitive",
                    },
                },
            ];
        }
        const result = await this.service.findAllAndCountCommune({
            where: whereCondition,
        });
        this.onSuccessAsList(res, result);
    }
}
