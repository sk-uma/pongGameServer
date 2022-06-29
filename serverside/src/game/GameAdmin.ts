import { Room } from './Room'
import { Socket } from 'socket.io';
import { Player } from './Player';
import { PrivateRoomAdmin } from './PrivateRoomAdmin';

export class GameAdmin {
  private playingList: Room [] = [];
  private privatewaitingList: PrivateRoomAdmin = new PrivateRoomAdmin();
  private leavedList: Room [] = [];
  private isPublicWaiting = false;
  private publicWaitingRoom: Room;
  private readonly debugLevel = 1;

  joinRoom(data: any, socket: Socket): void {
    let playerName = data.user.name;
    let rtv = this.searchRoomByPlayerName(playerName);
    let room = rtv?.room;

    // console.log(rtv.type);

    if (rtv.type === 'leaved') {
      room.reJoinRoom(playerName, socket);
      this.leavedList = this.leavedList.filter((x) => x !== room);
      this.playingList.push(room);
    } else if (rtv.type === 'notFound') {
      if (data.mode === 'public') {
        if (this.isPublicWaiting) {
          // 待機がいた場合
          this.publicWaitingRoom.clientJoinRoom(new Player(playerName, socket, 'client'));
          this.playingList.push(this.publicWaitingRoom);
          this.isPublicWaiting = false;
        } else {
          // 待機がいなかった場合
          this.publicWaitingRoom = new Room(new Player(playerName, socket), 'public');
          this.isPublicWaiting = true;
        }
      } else if (data.mode === 'private') {
        // console.log(data.privateKey);
        let rtv: any = this.privatewaitingList.joinRoom(playerName, socket, data.privateKey);
        if (rtv.status === 'success' && rtv.roomStatus === 'playing') {
          ;this.playingList.push(rtv.room);
        }
      }
    }

    // if (data.mode === 'public') {
    //   // TODO: fix
    //   // if (rtv.type !== 'notFound') {
    //   if (rtv.type === 'leaved') {
    //     room.reJoinRoom(playerName, socket);
    //     this.leavedList = this.leavedList.filter((x) => x !== room);
    //     this.playingList.push(room);
    //   } else if (this.isPublicWaiting) {
    //     // 待機がいた場合
    //     this.publicWaitingRoom.clientJoinRoom(new Player(playerName, socket, 'client'));
    //     this.playingList.push(this.publicWaitingRoom);
    //     this.isPublicWaiting = false;
    //   } else {
    //     // 待機がいなかった場合
    //     this.publicWaitingRoom = new Room(new Player(playerName, socket), 'public');
    //     this.isPublicWaiting = true;
    //   }
    // } else if (data.mode === 'private') {
    //   // console.log(data.privateKey);
    //   let rtv: any = this.privatewaitingList.joinRoom(playerName, socket, data.privateKey);
    //   if (rtv.status === 'success' && rtv.roomStatus === 'playing') {
    //     ;this.playingList.push(rtv.room);
    //   }
    // }
  
    if (this.debugLevel >= 1) {
      this.putGameStatus();
    }
  }

  joinPrivateRoom(data: any, socket: Socket): void {
    
  }

  leaveRoom(data: any, socket: Socket): void {
    let playerName = data.user.name;
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
    } else if (rtv.type === 'leaved') {
      room.leaveRoom(playerName);
      this.leavedList = this.leavedList.filter((x) => x !== room);
    } else if (rtv.type === 'publicWaiting') {
      room.leaveRoom(playerName);
      this.isPublicWaiting = !this.isPublicWaiting;
    } else if (rtv.type === 'privateWaiting') {
      this.privatewaitingList.leaveRoom(playerName, socket, data.privateKey);
    }
    if (this.debugLevel >= 1) {
      this.putGameStatus();
    }
  }

  searchRoomByPlayerName(playerName: string): {type: string, room?: Room} {
    let rtv: any;

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
    // console.log(this.isPublicWaiting, this.publicWaitingRoom.isPlayer(playerName));

    if (this.isPublicWaiting && this.publicWaitingRoom.isPlayer(playerName)) {
      return {
        type: 'publicWaiting',
        room: this.publicWaitingRoom
      }
    }

    rtv = this.privatewaitingList.searchRoomByPlayerName(playerName)
    if (rtv.status === 'success') {
      return {type: 'privateWaiting', room: rtv.room};
    }

    return {type: 'notFound', room: undefined};
  }

  getPrivateRoomAdmin(): PrivateRoomAdmin {
    return this.privatewaitingList;
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

export let gameAdmin: GameAdmin = new GameAdmin();
