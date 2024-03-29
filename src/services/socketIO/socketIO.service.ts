import { Socket, Server } from "socket.io";
import http from "http";

import { errorService, tokenService } from "..";
import { config } from "@/configs";
import { EAccountType } from "@/enums/accountType.enum";
import { userRepository } from "@/repositories";
type Connections = { [userId: string]: Socket };
export type ServerSocket = Server & { connections?: Connections };
export const SOCKET_EVENTS = {
    CONNECTION: "connection",
    DISCONNECT: "disconnect",
    // ON

    // EMIT
    USER_BOOKING_PROVIDER: "USER_BOOKING_PROVIDER",
    USER_HANDLED_BOOKING: "PROVIDER_HANDLED_BOOKING",
    PROVIDER_HANDLED_BOOKING: "PROVIDER_HANDLED_BOOKING",
    ADMIN_HANDLE_KYC: "ADMIN_HANDLE_KYC",
};

export const SOCKET_EXPRESS = "socketIO";
export class SocketService {
    init(app: http.Server) {
        /** Server Handling */
        this.httpServer = app; // http.createServer(app);

        const server = new Server(this.httpServer, {
            path: config.server.prefixPath.join("/socket/"),
            serveClient: false,
            pingInterval: 10000,
            pingTimeout: 5000,
            cookie: false,
            cors: {
                origin: "*",
            },
        });

        this.socketServer = server;
        this.socketServer.connections = {};
        this.socketIdMapUserId = {};
        console.log(`Socket running`);
        this.socketServer.use(this.authMiddleware.bind(this));
        this.socketServer.on(
            SOCKET_EVENTS.CONNECTION,
            this.StartListeners.bind(this)
        );
        (this.socketServer.sockets as any).userIds = {};
        return this.socketServer;
    }
    private httpServer: http.Server | undefined;
    private socketServer!: ServerSocket;
    private socketIdMapUserId!: { [socketId: string]: string };
    private async authMiddleware(socket: Socket, next: any) {
        const { authorization } = socket.handshake.auth;

        try {
            const token = authorization?.split(" ")[1];
            // 1. Validate token with user
            if (!token) {
                return next(errorService.unauthorized());
            }
            const result = tokenService.decodeToken(`${token}`);
            const { id: userId, type } = result;
            if (type == EAccountType.USER) {
                await userRepository.updateById(userId, {
                    isOnline: true,
                    latestOnline: new Date(),
                });
            }
            if (userId)
                (this.socketServer.connections as Connections)[userId] = socket;
            this.socketIdMapUserId[socket.id] = userId;

            return next();
        } catch (err) {
            return next(err);
        }
    }
    private handleSocketEvent(
        func: (socket: Socket, ...params: any[]) => any,
        socket: Socket
    ) {
        return (...args: any[]) => func.bind(this)(socket, ...args);
    }

    private StartListeners(socket: Socket) {
        const userId = this.socketIdMapUserId[socket.id];
        console.info(
            "Connect received from: [",
            socket.id,
            "] --- [",
            userId,
            "]"
        );
        socket.on(
            "Client-sent-message",
            this.handleSocketEvent(this.onClientSentMessage, socket)
        );

        socket.on(
            SOCKET_EVENTS.DISCONNECT,
            this.handleSocketEvent(this.onClientDisconnect, socket)
        );
    }

    private onClientSentMessage(socket: Socket, data: any) {
        const content = { ...data, socketId: socket.id };
        // Message to sender himseft
        socket.emit("Server-sent-message", content);

        // Message to all
        this.socketServer?.sockets.emit("Server-sent-message", content);
    }

    private onClientDisconnect(socket: Socket) {
        const userId = this.socketIdMapUserId[socket.id];
        if (userId) {
            userRepository.updateById(userId, {
                isOnline: false,
            });

            if (this.socketServer.connections) {
                delete this.socketServer.connections[userId];
            }

            delete this.socketIdMapUserId[socket.id];
        }
        console.info(
            "Disconnect received from: [",
            socket.id,
            "] --- [",
            userId,
            "]"
        );
    }

    public emitUserBookingProvider(socket: Socket, data: any) {
        console.log("USER_BOOKING_PROVIDER ===> ", data);
        socket.emit(SOCKET_EVENTS.USER_BOOKING_PROVIDER, data);
    }
    public emitProviderHandledBooking(socket: Socket, data: any) {
        console.log("PROVIDER_HANDLED_BOOKING ===> ", data);
        socket.emit(SOCKET_EVENTS.PROVIDER_HANDLED_BOOKING, data);
    }
    public emitUserHandledBooking(socket: Socket, data: any) {
        console.log("PROVIDER_HANDLED_BOOKING ===> ", data);
        socket.emit(SOCKET_EVENTS.PROVIDER_HANDLED_BOOKING, data);
    }
    public emitAdminHandledKYC(socket: Socket, data: any) {
        console.log("ADMIN_HANDLE_KYC ===> ", data);
        socket.emit(SOCKET_EVENTS.ADMIN_HANDLE_KYC, data);
    }
}
