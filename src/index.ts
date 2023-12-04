import { App } from "./app";
import { config } from "./configs";
import prisma from "./models/base.prisma";
import { seed } from "./models/prismas/seedData.prisma";

import { socketService } from "./services/socketIO";
import { SOCKET_EXPRESS } from "./services/socketIO/socketIO.service";

const express = new App();
const httpServer = express.init();
express.app.set(SOCKET_EXPRESS, socketService.init(httpServer));
if (config.server.run_seed_data) seed();
if (!config.server.is_localhost) {
    prisma.user.updateMany({ data: { isOnline: true } });
}
export { express, httpServer };
