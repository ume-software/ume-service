
import { App } from "./app";
import { seed } from "./models/prismas/seedData.prisma";
import { socketService } from "./services/socketIO";
import { SOCKET_EXPRESS } from "./services/socketIO/socketIO.service";

const express = new App();
const httpServer = express.init();
express.app.set(SOCKET_EXPRESS, socketService.init(httpServer));
seed();
