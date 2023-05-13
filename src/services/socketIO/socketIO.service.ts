import { Socket, Server } from "socket.io";
import http from "http";
import { IConnection, IRoom } from "@/interfaces/socket.interface";
import { errorService, tokenService } from "..";

export const SOCKET_EVENTS = {
    CONNECTION: "connection",
    DISCONNECT: "disconnect",
    // ON

    // EMIT

};
export class ServerSocket {
    public static instance: ServerSocket;

    init(app: http.Server) {
        /** Server Handling */
        this.httpServer = app; // http.createServer(app);

        ServerSocket.instance = this;

        this.socketServer = new Server(this.httpServer, {
            serveClient: false,
            pingInterval: 10000,
            pingTimeout: 5000,
            cookie: false,
            cors: {
                origin: "*",
            },
        });
        console.log(
            `Socket running`
        );
        this.socketServer.use(this.authMiddleware.bind(this));
        this.socketServer.on(
            SOCKET_EVENTS.CONNECTION,
            this.StartListeners.bind(this)
        );
    }
    private httpServer: http.Server | undefined;
    private socketServer!: Server;
    userIdMappingSocketId: { [userId: string]: string } = {};
    connections: { [socketId: string]: IConnection } = {};
    rooms: { [x: string]: IRoom } = {};
    channels: { [channelId: string]: IRoom } = {};
    private async authMiddleware(socket: Socket, next: any) {
        return next();
        const { room_name } = socket.handshake.query;
        const { authorization } = socket.handshake.auth;

        try {
            const token = authorization?.split(" ")[1];
            // 1. Validate token with user
            if (!token) {
                return next(errorService.auth.unauthorized());
            }
            const result: any = tokenService.decodeToken(`${token}`);
            const { id } = result;
            if (!this.connections[id]) {
                this.connections[id] = { uid: id, socket };
            }

            const room = `${room_name}`;
            socket.join(room);
            if (!room) {
                this.rooms[room] = {
                    sockets: [socket],
                    uids: [id],
                };
            }
            return next();
        } catch (err) {
            return next(err);
        }
    }

    private StartListeners(socket: Socket) {
        socket.on("Client-sent-message", (data) => {
            const content = { ...data, socketId: socket.id };
            // Message to sender himseft
            socket.emit("Server-sent-message", content);

            // Message to all
            this.socketServer?.sockets.emit("Server-sent-message", content);
        });

        socket.on(SOCKET_EVENTS.DISCONNECT, () => {
            console.info("Disconnect received from: " + socket.id);
        });
    }
}
