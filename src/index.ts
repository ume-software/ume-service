
import { App } from "./app";
import { seed } from "./models/prismas/seedData.prisma";
import { bookingService } from "./services";
import { socketService } from "./services/socketIO";
import { SOCKET_EXPRESS } from "./services/socketIO/socketIO.service";

const express = new App();
const httpServer = express.init();
express.app.set(SOCKET_EXPRESS, socketService.init(httpServer));
seed();
bookingService.getCurrentBookingForProvider("9985b3de-3963-49a4-a6ac-aa5f273fd2b4")
bookingService.getCurrentBookingForUser("9985b3de-3963-49a4-a6ac-aa5f273fd2b4")