import { Room } from './Room'
import { Socket } from 'socket.io';
import { Player } from './Player';
import { PrivateRoomAdmin } from './PrivateRoomAdmin';
import { PublicWaitingRoomAdmin } from './PublicWaitingRoomAdmin';

export class GameAdmin {
  private playingList: Room [] = [];
  private privatewaitingList: PrivateRoomAdmin = new PrivateRoomAdmin();
  private publicWaitingList: PublicWaitingRoomAdmin = new PublicWaitingRoomAdmin();
  private leavedList: Room [] = [];
  private readonly debugLevel = 1;

  joinRoom(data: any, socket: Socket): void {
    let playerName = data.user.name;
    let rtv = this.searchRoomByPlayerName(playerName);
    let room = rtv?.room;

    if (rtv.type === 'leaved') {
      room.reJoinRoom(playerName, socket);
      this.leavedList = this.leavedList.filter((x) => x !== room);
      this.playingList.push(room);
    } else if (rtv.type === 'notFound') {
      if (data.mode === 'public') {
        let rtv: any = this.publicWaitingList.joinRoom(playerName, socket, data.gameType);
        if (rtv.status === 'success' && rtv.roomStatus === 'playing') {
          this.playingList.push(rtv.room);
        }
      } else if (data.mode === 'private') {
        let rtv: any = this.privatewaitingList.joinRoom(playerName, socket, data.privateKey);
        if (rtv.status === 'success' && rtv.roomStatus === 'playing') {
          this.playingList.push(rtv.room);
        }
      }
    }
  
    if (this.debugLevel >= 1) {
      this.putGameStatus();
    }
  }

  leaveRoom(data: any, socket: Socket): void {
    let playerName = data.user.name;
    for (const room of socket.rooms) {
      if (room !== socket.id) {
        socket.broadcast.to(room).emit('PlayerLeaveRoom');
      }
    }

    let rtv = this.searchRoomByPlayerName(playerName);
    let room = rtv.room;
    if (rtv.type === 'playing') {
      room.leaveRoom(data, playerName);
      this.playingList = this.playingList.filter((x) => x !== room);
      this.leavedList.push(room);
    } else if (rtv.type === 'leaved') {
      room.leaveRoom(data, playerName);
      this.leavedList = this.leavedList.filter((x) => x !== room);
    } else if (rtv.type === 'publicWaiting') {
      this.publicWaitingList.leaveRoom(playerName, socket, data.gameType, data);
    } else if (rtv.type === 'privateWaiting') {
      this.privatewaitingList.leaveRoom(playerName, socket, data.privateKey);
    }

    if (this.debugLevel >= 1) {
      this.putGameStatus();
    }
  }

  disconnectRoom(socket: Socket): void {
    
  }

  startWatching(data: any, socket: Socket): void {
    let rtv = this.searchRoomByRoomId(data.roomId);
    if (rtv.type === 'playing') {
      rtv.room.startWatching(socket);
    }
  }

  finishWatching(data: any, socket: Socket): void {
    let rtv = this.searchRoomByRoomId(data.roomId)
    if (rtv.type === 'playing') {
      rtv.room.finishWatching(socket);
    }
  }

  searchRoomByPlayerName(playerName: string): {type: string, room?: Room} {
    let rtv: any;

    for (const room of this.playingList) {
      if (room.isPlayer(playerName)) {
        return {
          type: 'playing',
          room: room
        };
      }
    }
    for (const room of this.leavedList) {
      if (room.isPlayer(playerName)) {
        return {
          type: 'leaved',
          room: room
        };
      }
    }

    rtv = this.publicWaitingList.searchRoomByPlayerName(playerName);
    if (rtv.status === 'success') {
      return {type: 'publicWaiting', room: rtv.room};
    }

    rtv = this.privatewaitingList.searchRoomByPlayerName(playerName);
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
      if (room.getRoomId() === roomId) {
        return {
          type: 'playing',
          room: room
        };
      }
    }
    for (const room of this.leavedList) {
      if (room.getRoomId() === roomId) {
        return {
          type: 'leaved',
          room: room
        };
      }
    }

    let rtv: any;
    rtv = this.publicWaitingList.searchRoomByRoomId(roomId);
    if (rtv.status === 'success') {
      return {type: 'publicWaiting', room: rtv.room};
    }
    rtv = this.privatewaitingList.searchRoomByRoomId(roomId);
    if (rtv.status === 'success') {
      return {type: 'privateWaiting', room: rtv.room};
    }
    return {type: 'notFound'};
  }

  getPlayingRoom() {
    let rtv = [];
    for (const room of this.playingList) {
      rtv.push(
        room.getRoomInfo()
      );
    }
    return rtv;
  }

  /**
   * デバッグ用: 全ルームのステータス表示
   */
  putGameStatus(): void {

    console.log('+-------------------- playing --------------------+');
    for (const room of this.playingList) {
      room.putRoomStatus();
    }

    console.log('+---------------- public waiting -----------------+');
    this.publicWaitingList.putAllRoomStatus();

    console.log('+---------------- private waiting ----------------+');
    this.privatewaitingList.putAllRoomStatus();

    console.log('+-------------------- Leaved  --------------------+');
    for (const room of this.leavedList) {
      room.putRoomStatus();
    }

    console.log();
  }

  eventGameData(data: any, socket: Socket) {
    let rtv = this.searchRoomByRoomId(data?.roomId);
    let room = rtv.room;
    if (rtv.type !== 'notFound') {
      room.eventGameData(data, socket);
    }
  }
}

export let gameAdmin: GameAdmin = new GameAdmin();
