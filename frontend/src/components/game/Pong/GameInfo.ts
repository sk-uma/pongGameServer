import { Socket } from "socket.io-client";

export interface GameInfo {
    socket: Socket;
    roomID: String;
    isServer: boolean;
}