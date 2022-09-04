import { Socket } from "socket.io";

type PlayerStatus = 'connected' | 'disconnected';
type PlayerType = 'host' | 'client';

export class Player {
  private playerName: string;
  private socket: Socket;
  // private roomId: string;
  private status: PlayerStatus = 'connected';
  private playerType: PlayerType;

  constructor(playerName: string, socket: Socket, playerType: PlayerType='host') {
    this.playerName = playerName;
    this.status = 'connected';
    this.playerType = playerType;
    this.socket = socket;
  }

  joinRoom(roomId: string) {
    this.status = 'connected';
    this.socket.join(roomId);
  }

  reJoinRoom(roomId: string, socket: Socket, payloadGameData) {
    this.status = 'connected';
    this.socket = socket;
    this.socket.join(roomId);
    this.opponentIsReadyToStart(roomId, payloadGameData);
  }

  leaveRoom(roomId: string) {
    this.status = 'disconnected';
    this.socket.leave(roomId);
    this.socket = undefined;
  }

  setStatus(status: PlayerStatus) {
    this.status = status;
  }

  opponentIsReadyToStart(roomId, payloadGameData) {
    this.socket.emit('opponentIsReadyToStart', {
      roomId: roomId,
      isServer: this.playerType === 'host',
      gameData: payloadGameData
    })
  }

  restartGame(roomId, payloadGameData) {
    var message = {
      roomId: roomId,
      isServer: this.playerType === 'host',
      gameData: payloadGameData
    };
    if (this.playerType === 'host') {
      this.socket.emit('restartGame', message);
      this.socket.broadcast.to(roomId).emit('restartGame', message);
    } else {
    }
    // this.socket.emit('restartGame', {
    //   roomId: roomId,
    //   isServer: this.playerType === 'host',
    //   gameData: payloadGameData
    // });
  }

  getName(): string {
    return this.playerName;
  }

  getSocketId(): string {
    return this.socket.id;
  }

  getStatus(): PlayerStatus {
    return this.status;
  }

  sendGameStartMessage(roomId: string): void {
    var message = {
      roomId: `${roomId}`,
      isServer: this.playerType === 'host'
    }
    if (this.playerType === 'host') {
      this.socket.emit('opponentIsReadyToStart', message)
    } else {
      this.socket.broadcast.to(roomId).emit('opponentIsReadyToStart', message);
    }
  }
}
