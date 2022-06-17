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
    let rtv = this.searchRoomByPlayerName(playerName);
    let room = rtv?.room;
    if (room !== undefined) {
      room.reJoinRoom(playerName, socket);
      this.leavedList = this.leavedList.filter((x) => x !== room);
      this.playingList.push(room);
    } else if (this.isPublicWaiting) {
      this.publicWaitingRoom.clientJoinRoom(new Player(playerName, socket, 'client'));
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
        // console.log("room:", room);
        socket.broadcast.to(room).emit('PlayerLeaveRoom');
      }
    }

    let rtv = this.searchRoomByPlayerName(playerName);
    let room = rtv.room;
    // console.log(playerName, room);
    if (rtv.type === 'playing') {
      room.leaveRoom(playerName);
      this.playingList = this.playingList.filter((x) => x !== room);
      this.leavedList.push(room);
    } else if (rtv.type === 'publicWaiting') {
      room.leaveRoom(playerName);
      this.isPublicWaiting = !this.isPublicWaiting;
    } else if (rtv.type === 'leaved') {
      room.leaveRoom(playerName);
      this.leavedList = this.leavedList.filter((x) => x !== room);
    }
    if (this.debugLevel >= 1) {
      this.putGameStatus();
    }
  }

  searchRoomByPlayerName(playerName: string): {type: string, room?: Room} {
    // let room: Room = undefined;
    for (const room of this.playingList) {
      // console.log("room:", room);
      if (room.isPlayer(playerName)) {
        return {
          type: 'playing',
          room: room
        };
      }
    }
    for (const room of this.leavedList) {
      // console.log("room:", room);
      if (room.isPlayer(playerName)) {
        return {
          type: 'leaved',
          room: room
        };
      }
    }
    if (this.isPublicWaiting && this.publicWaitingRoom.isPlayer(playerName)) {
      return {
        type: 'publicWaiting',
        room: this.publicWaitingRoom
      }
    }
    return {type: 'notFound', room: undefined};
  }

  searchRoomByRoomId(roomId: string): {type: string, room?: Room} {
    for (const room of this.playingList) {
      // console.log("room:", room);
      if (room.getRoomId() === roomId) {
        return {
          type: 'playing',
          room: room
        };
      }
    }
    for (const room of this.leavedList) {
      // console.log("room:", room);
      if (room.getRoomId() === roomId) {
        return {
          type: 'leaved',
          room: room
        };
      }
    }
    if (this.isPublicWaiting && this.publicWaitingRoom.getRoomId() === roomId) {
      return {
        type: 'publicWaiting',
        room: this.publicWaitingRoom
      }
    }
    return {type: 'notFound', room: undefined};
  }

  // updateGameData(data: any, socket: Socket) {
  //   for (const room of socket.rooms) {
  //     if (room !== socket.id) {
  //       socket.broadcast.to(room).emit('UpdateCheckedGameData', data);
  //     }
  //   }
  // }

  /**
   * デバッグ用: 全ルームのステータス表示
   */
  putGameStatus(): void {

    console.log('+-------------------- playing --------------------+');
    for (const room of this.playingList) {
      room.putRoomStatus();
    }
  
    console.log('+-------------------- waiting --------------------+');
    if (this.isPublicWaiting) {
      this.publicWaitingRoom.putRoomStatus();
    }

    console.log('+-------------------- Leaved  --------------------+');
    for (const room of this.leavedList) {
      room.putRoomStatus();
    }

    console.log();
  }

  eventGameData(data: any, socket: Socket) {
    let rtv = this.searchRoomByRoomId(data?.roomId);
    let room = rtv.room;
    // console.log(rtv);
    if (rtv.type !== 'notFound') {
      room.eventGameData(data, socket);
    }
  }
}
