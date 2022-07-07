import axios from "axios";
import { Socket } from "socket.io";
import { Pong } from "./Games/Pong";
import { PongDX } from "./Games/PongDX";
import { GameStatus } from "./GameStatus";
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
  // private gameData: GameData;
  private gameType: GameType;
  // private gameType: GameType;

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
    // this.gameData = {
    //   score: {
    //     hostPlayerScore: 0,
    //     clientPlayerScore: 0
    //   }
    // }
  }

  /**
   * client側 プレイヤーの初回接続時の処理
   * @param clientPlayer 接続要求のあったプレイヤー
   */
  clientJoinRoom(clientPlayer: Player) {
    this.clientPlayer = clientPlayer;
    this.clientPlayer.joinRoom(this.roomId);
    this.status = 'playing';
    // this.hostPlayer.opponentIsReadyToStart(this.roomId, this.gameData);
    // this.clientPlayer?.opponentIsReadyToStart(this.roomId, this.gameData);
    this.hostPlayer.opponentIsReadyToStart(this.roomId, this.gameType.getGameData());
    this.clientPlayer?.opponentIsReadyToStart(this.roomId, this.gameType.getGameData());
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
    // console.log('rejoin');
    if ((player = this.getPlayer(playerName)) !== undefined) {
      // console.log(this.hostPlayer === undefined, this.clientPlayer === undefined);
      // console.log(this.clientPlayer);
      player.reJoinRoom(this.roomId, socket, this.gameType.getGameData());
      // socket.emit('hello', 'hello!!!!');
      this.hostPlayer.restartGame(this.roomId, this.gameType.getGameData());
      this.clientPlayer?.restartGame(this.roomId, this.gameType.getGameData());
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

  startWatching(socket: Socket): void {
    socket.join(this.roomId);
  }

  finishWatching(socket: Socket): void {
    socket.leave(this.roomId);
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

    // if (data.eventType === 'getPoint') {
    //   this.gameData.score.hostPlayerScore = data.data.hostScore;
    //   this.gameData.score.clientPlayerScore = data.data.clientScore;
    // } else if (data.eventType === 'gameOver') {
    //   axios.post('localhost:3001/history', {
    //     leftPlayer: this.hostPlayer.getName(),
    //     rightPlayer: this.clientPlayer.getName(),
    //     leftScore: data.data.hostScore,
    //     rightScore: data.data.clientScore
    //   });
    // }

    // console.log(data.data);
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

  // getScore(): {hostPlayerScore: number, clientPlayerScore: number} {
  //   return {
  //     hostPlayerScore: this.gameData.hostPlayerScore,
  //     clientPlayerScore: this.gameData.clientPlayerScore
  //   }
  // }

  getGameData(dataType: string): {type: string, data?: any} {
    // if (dataType === 'score') {
    //   return {
    //     type: 'score',
    //     data: {
    //       hostPlayerScore: this.gameData.score.hostPlayerScore,
    //       clientPlayerScore: this.gameData.score.clientPlayerScore
    //     }
    //   };
    // } else {
    //   return {type: 'notFound'};
    // }
    return this.gameType.getGameDataByType(dataType);
  }

  setStatus(status: Status) {
    this.status = status;
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
