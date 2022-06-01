import { Socket } from "socket.io";

type PlayerStatus = 'connected' | 'disconnected';
type PlayerType = 'host' | 'client';

export class Player {
  private playerName: string;
  private socket: Socket;
  private roomId: string;
  private status: PlayerStatus = 'connected';
  private playerType: PlayerType;

  constructor(playerName: string, socket: Socket, playerType: PlayerType='host') {
    this.playerName = playerName;
    this.status = 'connected';
    this.playerType = playerType;
  }

  joinRoom(roomId: string) {
    this.roomId = roomId;
    this.status = 'connected';
    this.socket.join(this.roomId);
  }

  reJoinRoom(socket: Socket) {
    this.status = 'connected';
    this.socket = socket;
    this.socket.join(this.roomId);
  }

  leaveRoom() {
    this.status = 'disconnected';
    this.socket.leave(this.roomId);
  }

  getRoomId(): string {
    return this.roomId;
  }

  getName(): string {
    return this.playerName;
  }

  sendGameStartMessage(): void {
    var message = {
      roomId: `${this.roomId}`,
      isServer: this.playerType == 'host'
    }
    if (this.playerType == 'host') {
      this.socket.emit('opponentIsReadyToStart', message)
    } else {
      this.socket.broadcast.to(this.roomId).emit('opponentIsReadyToStart', message);
    }
  }
}