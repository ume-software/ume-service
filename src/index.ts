
import { App } from "./app";

// import { scheduleService } from "./services";
import { serverSocket } from "./services/socketIO";

const app = new App();
// scheduleService.run();
const httpServer = app.init();
serverSocket.init(httpServer);