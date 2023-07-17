import express, { Express, Request, Response } from "express";
import api from "@/controllers/router";
import {
    decryptMiddleware,
    loggerMiddleware,
    morganMiddleware,
    parseRequestMiddleware,
    queryPrismaMiddleware,
} from "./middlewares";
import { config } from "./configs";
import cors from 'cors';
// import * as swagger from 'decorators';
import "reflect-metadata";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger/swagger.config";
import prisma from "./models/base.prisma";
import path from "path";
export class App {
    constructor() {
        this.app = express();
        this.middleware();
        this.app.use(cors({
            origin: "*"
        }));
        this.app.set("views", path.join(__dirname, "../views"));
        this.app.set("view engine", "ejs");

        this.app.use(
            "/api-docs",
            swaggerUi.serve,
            swaggerUi.setup(swaggerSpec)
        );

        this.app.use(
            "/static",
            express.static(path.join(__dirname, "../public"))
        );
        this.app.get("/policy", (_req: Request, res: Response) => {
            var links = [
                { href: "https://www.facebook.com/", text: "Facebook" },
                { href: "https://viblo.asia/", text: "Viblo" },
            ];
            res.render("policy", {
                links,
            });
        });
        this.app.get("/", (_req: Request, res: Response) => {
            res.render("index");
        });
        this.app.use(loggerMiddleware.run());
        this.app.use(morganMiddleware.run());
        this.app.use(api);
    }
    public app: Express;

    private middleware() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(parseRequestMiddleware.run());
        this.app.use(queryPrismaMiddleware.run());
        this.app.use("/system", decryptMiddleware.run());
    }

    public init(port = config.server.port) {
        const httpServer = this.app.listen(port, () => {
            return console.log(
                `Express is listening at http://localhost:${port}`
            );
        });
        this.app.on("close", async () => {
            await prisma.$disconnect();
        });

        return httpServer;
    }
}
