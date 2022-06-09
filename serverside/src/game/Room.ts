import { Socket } from "socket.io";
import { GameStatus } from "./GameStatus";
import { Player } from "./Player";

type Status = 'playing' | 'waiting' | 'leaved';
type RoomType = 'private' | 'public';

export class Room {
  private status: Status = 'waiting';
  private hostPlayer: Player;
  private clientPlayer?: Player;
  private roomId: string;
  private roomType: RoomType;
  private gameData;
  // private gameType: GameType;

  constructor(hostPlayer: Player, type: RoomType='public') {
    this.hostPlayer = hostPlayer;
    this.roomId = `room_${hostPlayer.getName()}`;
    this.hostPlayer.joinRoom(this.roomId);
    this.roomType = type;
    this.gameData = {
      hostPoint: 0,
      clientPoint: 0
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
    this.hostPlayer.opponentIsReadyToStart(this.roomId);
    this.clientPlayer?.opponentIsReadyToStart(this.roomId);
    // clientPlayer.broadcast.to(this.roomId).emit('UpdateCheckedGameData', data);
    // this.hostPlayer.broadcast();
  }

  /**
   * プレイヤーの再接続処理
   * @param playerName 再接続要求のあったプレイヤー名
   * @param socket 再接続要求のあったプレイヤーのソケット
   */
  reJoinRoom(playerName: string, socket: Socket) {
    var player: Player = undefined;
    // for (var room of socket.rooms) {
    //   console.log(room);
    // }
    if ((player = this.getPlayer(playerName)) !== undefined) {
      // console.log('rejoin');
      player.reJoinRoom(this.roomId, socket);
      this.hostPlayer.restartGame(this.roomId, this.gameData);
      this.clientPlayer?.restartGame(this.roomId, this.gameData);
    }
    // for (var room of socket.rooms) {
    //   console.log(room);
    // }
  }

  /**
   * プレイヤーの切断処理
   * @param playerName 切断要求のあったプレーヤー名
   */
  leaveRoom(playerName: string) {
    var player: Player = undefined;
    if ((player = this.getPlayer(playerName)) !== undefined) {
      player.leaveRoom(this.roomId);
    }
    this.status = 'leaved';
  }

  updateGameData(data: any, socket: Socket) {
    // TODO: check game data
    socket.broadcast.to(this.roomId).emit('UpdateCheckedGameData', data);
  }

  /**
   * room内にいるPlayer, 観戦者にゲームの開始を通知する
   */
  // sendGameStartMessage(): void {
  //   this.hostPlayer.sendGameStartMessage(this.roomId);
  //   this.clientPlayer.sendGameStartMessage(this.roomId);
  // }

  isPlayer(playerName: string): boolean {
    return (this.hostPlayer?.getName() == playerName) || (this.clientPlayer?.getName() == playerName);
  }

  getPlayer(playerName: string): Player {
    if (this.hostPlayer.getName() == playerName) {
      return this.hostPlayer;
    } else if (this.clientPlayer.getName() == playerName) {
      return this.clientPlayer;
    }
    return undefined;
  }

  /**
   * デバッグ用: ルームステータスの表示
   */
  putRoomStatus() {
    console.log(`| * ${this.roomId} (${this.roomType}:${this.status})`)
    console.log(`| hostplayer  : ${this.hostPlayer.getName()} is ${this.hostPlayer.getStatus()}`);
    console.log(`| clientplayer: ${this.clientPlayer?.getName()} is ${this.clientPlayer?.getStatus()}`);
    // console.log('+-------------------- Leaved  --------------------+');
    console.log('+-------------------------------------------------+');
  }
}
