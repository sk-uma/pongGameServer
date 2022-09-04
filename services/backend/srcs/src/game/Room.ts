import { Socket } from "socket.io";
import { Pong } from "./Games/Pong";
import { PongDX } from "./Games/PongDX";
import { Player } from "./Player";

type Status = 'playing' | 'waiting' | 'leaved';
type RoomType = 'private' | 'public';
type GameType = Pong | PongDX;

type GameData = {
  score: {
    hostPlayerScore: number;
    clientPlayerScore: number;
  }
}

export class Room {
  private status: Status = 'waiting';
  private hostPlayer: Player;
  private clientPlayer?: Player;
  private roomId: string;
  private roomType: RoomType;
  private gameType: GameType;

  constructor(hostPlayer: Player, gameType: 'pong' | 'pongDX', type: RoomType='public') {
    this.hostPlayer = hostPlayer;
    this.roomId = `room_${hostPlayer.getName()}`;
    if (type === 'public') {
      this.hostPlayer.joinRoom(this.roomId);
    }
    this.roomType = type;
    if (gameType === 'pong') {
      this.gameType = new Pong();
    } else if (gameType === 'pongDX') {
      this.gameType = new PongDX();
    }
  }

  /**
   * client側 プレイヤーの初回接続時の処理
   * @param clientPlayer 接続要求のあったプレイヤー
   */
  clientJoinRoom(clientPlayer: Player) {
    this.clientPlayer = clientPlayer;
    this.clientPlayer.joinRoom(this.roomId);
    this.status = 'playing';
    this.hostPlayer.opponentIsReadyToStart(this.roomId, this.gameType.getGameData());
    this.clientPlayer?.opponentIsReadyToStart(this.roomId, this.gameType.getGameData());
  }

  /**
   * プレイヤーの再接続処理
   * @param playerName 再接続要求のあったプレイヤー名
   * @param socket 再接続要求のあったプレイヤーのソケット
   */
  reJoinRoom(playerName: string, socket: Socket) {
    var player: Player = undefined;

    if ((player = this.getPlayer(playerName)) !== undefined) {
      player.reJoinRoom(this.roomId, socket, this.gameType.getGameData());
      this.hostPlayer.restartGame(this.roomId, this.gameType.getGameData());
      this.clientPlayer?.restartGame(this.roomId, this.gameType.getGameData());
    }
  }

  /**
   * プレイヤーの切断処理
   * @param playerName 切断要求のあったプレーヤー名
   */
  leaveRoom(data: any, playerName: string) {
    var player: Player = undefined;
    if ((player = this.getPlayer(playerName)) !== undefined) {
      player.leaveRoom(this.roomId);
    }
    this.gameType.updateGameData(data.gameData);
    this.status = 'leaved';
  }

  startWatching(socket: Socket): void {
    socket.join(this.roomId);
    socket.emit('startWatchingData', this.gameType.getGameData());
  }

  finishWatching(socket: Socket): void {
    socket.leave(this.roomId);
  }

  updateGameData(data: any, socket: Socket) {
    // TODO: check game data
    socket.broadcast.to(this.roomId).emit('UpdateCheckedGameData', data);
  }

  isPlayer(playerName: string): boolean {
    return (this.hostPlayer?.getName() === playerName) || (this.clientPlayer?.getName() === playerName);
  }

  eventGameData(data: any, socket: Socket) {
    this.gameType.callEvent(data, socket);
    if (data.eventType === 'gameOver') {
      let preloadData = {
        gameType: this.gameType.getName(),
        hostPlayer: {
          name: this.hostPlayer.getName(),
          score: this.gameType.getGameData().score.hostPlayerScore,
        },
        clientPlayer: {
          name: this.clientPlayer.getName(),
          score: this.gameType.getGameData().score.clientPlayerScore,
        }
      }
      socket.broadcast.to(this.roomId).emit('gameResult', preloadData);
      socket.emit('gameResult', preloadData);
    }
  }

  /**
   * Getter
   */

  getPlayer(playerName: string): Player {
    if (this.hostPlayer.getName() == playerName) {
      return this.hostPlayer;
    } else if (this.clientPlayer.getName() == playerName) {
      return this.clientPlayer;
    }
    return undefined;
  }

  getPlayerBySocketId(socketId: string): Player {
    if (this.hostPlayer.getStatus() === 'connected' && this.hostPlayer.getSocketId() === socketId) {
      return this.hostPlayer;
    } else if (this.clientPlayer?.getStatus() === 'connected' && this.clientPlayer?.getSocketId() === socketId) {
      return this.clientPlayer;
    }
    return undefined;
  }

  getRoomId(): string {
    return this.roomId;
  }

  getHostPlayer(): Player {
    return this.hostPlayer;
  }

  getClientPlayer(): Player {
    return this.clientPlayer;
  }

  getGameData(dataType: string): {type: string, data?: any} {
    return this.gameType.getGameDataByType(dataType);
  }

  getStatus(): Status {
    return this.status;
  }

  getRoomInfo() {
    return {
      gameType: this.gameType.getName(),
      roomId: this.roomId,
      player: {
        hostPlayer: this.hostPlayer.getName(),
        clientPlayer: this.clientPlayer.getName()
      }
    }
  }

  /**
   * Setter
   */

  setStatus(status: Status) {
    this.status = status;
  }

  /**
   * デバッグ用: ルームステータスの表示
   */
  putRoomStatus() {
    console.log(`| * ${this.roomId} (${this.roomType}:${this.status})`)
    console.log(`| hostplayer  : ${this.hostPlayer.getName()} is ${this.hostPlayer.getStatus()}`);
    console.log(`| clientplayer: ${this.clientPlayer?.getName()} is ${this.clientPlayer?.getStatus()}`);
    console.log('+-------------------------------------------------+');
  }
}
