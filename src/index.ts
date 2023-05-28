
import { App } from "./app";
// import { seed } from "./models/prismas/seedData.prisma";

// import { scheduleService } from "./services";
import { serverSocket } from "./services/socketIO";

const app = new App();
// scheduleService.run();
const httpServer = app.init();
serverSocket.init(httpServer);
// seed()