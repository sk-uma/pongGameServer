import { Game } from './Game'
import { Socket } from 'socket.io';
import { Player } from './Player';

export class GameAdmin {
  private playingList: Game[] = [];
  private PrivatewaitingList: Game[] = [];
  private leavedList: Game[] = [];
  private isPublicWaiting = false;
  private publicWaitingRoom: Game;

  joinRoom(playerName: string, socket: Socket): void {
    let game: Game = this.searchRoomByPlayerName(playerName);
    if (game !== undefined) {
      game.reJoinRoom(playerName, socket);
      this.leavedList = this.leavedList.filter((x) => x !== game);
      this.playingList.push(game);
    } else if (this.isPublicWaiting) {
      this.publicWaitingRoom.joinRoom(new Player(playerName, socket));
      this.playingList.push(this.publicWaitingRoom);
      this.isPublicWaiting = false;
    } else {
      this.publicWaitingRoom = new Game(new Player(playerName, socket), 'public');
      this.isPublicWaiting = true;
    }
  }

  leaveRoom(playerName: string, socket: Socket): void {
    for (const room of socket.rooms) {
      if (room !== socket.id) {
        socket.broadcast.to(room).emit('PlayerLeaveRoom');
      }
    }
    var game: Game = this.searchRoomByPlayerName(playerName);
    game.leaveRoom(playerName);
    this.playingList = this.playingList.filter((x) => x !== game);
    this.leavedList.push(game);
  }

  searchRoomByPlayerName(playerName: string): Game {
    let game: Game = undefined;
    for (const game of this.playingList) {
      if (game.isPlayer(playerName)) {
        return game;
      }
    }
    return undefined;
  }
}
