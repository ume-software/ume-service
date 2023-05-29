
import { App } from "./app";
import { seed } from "./models/prismas/seedData.prisma";

import { serverSocket } from "./services/socketIO";

const app = new App();
const httpServer = app.init();
serverSocket.init(httpServer);
seed();