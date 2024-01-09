import {
    BaseController,
    Request,
    Response,
} from "@/controllers/base/base.controller";
import { momoService } from "@/services";
import { MomoService } from "@/services/api/v1/momo.service";
export class MomoWebhookController extends BaseController {
    constructor() {
        super();
        this.service = momoService;
        this.path = "momo_webhook";
        this.customRouting();
    }
    private service: MomoService;
    customRouting() {
        this.router.get("", this.route(this.momoWebhook));
    }

    async momoWebhook(req: Request, res: Response) {
        await this.service.handleWebhook(req);
        res.send(
            '<script>window.open("", "_blank", "");window.close();</script>'
        );
    }
}
