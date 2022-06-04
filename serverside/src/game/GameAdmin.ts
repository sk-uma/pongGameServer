import { Room } from './Room'
import { Socket } from 'socket.io';
import { Player } from './Player';

export class GameAdmin {
  private playingList: Room [] = [];
  private PrivatewaitingList: Room [] = [];
  private leavedList: Room [] = [];
  private isPublicWaiting = false;
  private publicWaitingRoom: Room;
  private readonly debugLevel = 1;

  joinRoom(playerName: string, socket: Socket): void {
    let room: Room = this.searchRoomByPlayerName(playerName);
    if (room !== undefined) {
      room.reJoinRoom(playerName, socket);
      this.leavedList = this.leavedList.filter((x) => x !== room);
      this.playingList.push(room);
    } else if (this.isPublicWaiting) {
      this.publicWaitingRoom.joinRoom(new Player(playerName, socket));
      this.playingList.push(this.publicWaitingRoom);
      this.isPublicWaiting = false;
    } else {
      this.publicWaitingRoom = new Room(new Player(playerName, socket), 'public');
      this.isPublicWaiting = true;
    }
    if (this.debugLevel >= 1) {
      this.putGameStatus();
    }
  }

  leaveRoom(playerName: string, socket: Socket): void {
    for (const room of socket.rooms) {
      if (room !== socket.id) {
        socket.broadcast.to(room).emit('PlayerLeaveRoom');
      }
    }
    var room: Room = this.searchRoomByPlayerName(playerName);
    room.leaveRoom(playerName);
    this.playingList = this.playingList.filter((x) => x !== room);
    this.leavedList.push(room);
    if (this.debugLevel >= 1) {
      this.putGameStatus();
    }
  }

  searchRoomByPlayerName(playerName: string): Room {
    let room: Room = undefined;
    for (const room of this.playingList) {
      if (room.isPlayer(playerName)) {
        return room;
      }
    }
    return undefined;
  }

  /**
   * デバッグ用: 全ルームのステータス表示
   */
  putGameStatus(): void {
    console.log('+---------- playing ----------+');
    for (const room of this.playingList) {
      room.putRoomStatus();
    }
  
    console.log('+---------- waiting ----------+');
    this.publicWaitingRoom.putRoomStatus();
  
    console.log('+---------- Leaved  ----------+');
    for (const room of this.leavedList) {
      room.putRoomStatus();
    }
  }
}
