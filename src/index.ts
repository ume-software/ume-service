
import { App } from "./app";

import { cryptoService, scheduleService } from "./services";
import { serverSocket } from "./services/socketIO";

const app = new App();
serverSocket.init(app.app);
scheduleService.run();
app.init()


cryptoService.generateKeyPairSync('pem', true, 'identity')