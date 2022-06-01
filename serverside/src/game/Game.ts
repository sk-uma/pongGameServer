import { Socket } from "socket.io";
import { GameStatus } from "./GameStatus";
import { Player } from "./Player";

type Status = 'playing' | 'waiting' | 'leaved';
type RoomType = 'private' | 'public';

export class Game {
  private status: Status = 'playing';
  private hostPlayer: Player;
  private clientPlayer: Player;
  private roomId: string;
  private roomType: RoomType;
  // private gameType: GameType;

  constructor(hostPlayer: Player, type: RoomType='public') {
    this.hostPlayer = hostPlayer;
    this.roomId = `room_${hostPlayer.getName()}`;
    this.roomType = type;
  }

  joinRoom(clientPlayer: Player) {
    this.clientPlayer = clientPlayer;
    this.clientPlayer.joinRoom(this.roomId);
  }

  reJoinRoom(playerName: string, socket: Socket) {
    var player: Player = undefined;
    if ((player = this.getPlayer(playerName)) !== undefined) {
      player.reJoinRoom(socket);
    }
  }

  leaveRoom(playerName: string) {
    var player: Player = undefined;
    if ((player = this.getPlayer(playerName)) !== undefined) {
      player.leaveRoom();
    }
    this.status = 'leaved';
  }

  /**
   * room内にいるPlayer, 観戦者にゲームの開始を通知する
   */
  sendGameStartMessage(): void {
    this.hostPlayer.sendGameStartMessage();
    this.clientPlayer.sendGameStartMessage();
  }

  isPlayer(playerName: string): boolean {
    return (this.hostPlayer.getName() == playerName) || (this.clientPlayer.getName() == playerName);
  }

  getPlayer(playerName: string): Player {
    if (this.hostPlayer.getName() == playerName) {
      return this.hostPlayer;
    } else if (this.clientPlayer.getName() == playerName) {
      return this.clientPlayer;
    }
    return undefined;
  }
}
