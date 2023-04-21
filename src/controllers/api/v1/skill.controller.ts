import { BaseController } from "@/controllers/base/base.controller";
import { skillService } from "@/services";
import { SkillService } from "@/services/api/v1/skill.service";
import { ApiPath } from "express-swagger-typescript";

@ApiPath({
    path: '/api/v1/auth',
    name: 'Auth',
})
export class AuthController extends BaseController {
    constructor() {
        super()
        this.service = skillService;
        this.path = 'auth'
        // this.router.get("/info", this.accountTypeMiddlewares([EAccountType.USER]), this.route(this.getInfo))

    }
    service: SkillService
}