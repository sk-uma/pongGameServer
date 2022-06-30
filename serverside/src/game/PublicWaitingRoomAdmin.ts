import { Socket } from "socket.io";
import { Player } from "./Player";
import { Result } from "./Result";
import { Room } from "./Room";

type ReturnStatus = 'success' | 'failure';
type RoomStatus   = 'playing' | 'waiting' | 'leaved';
type GameType     = 'pong' | 'pongDX';
type MetaRoomType = {
  already: boolean;
  room?: Room;
}

export class PublicWaitingRoomAdmin {
  private roomMap: Map<GameType, MetaRoomType> = new Map<GameType, MetaRoomType>();

  constructor() {
    this.roomMap.set('pong', {already: false});
    this.roomMap.set('pongDX', {already: false});
  }

  joinRoom(playerName: string, socket: Socket, gameType: GameType): {status: ReturnStatus, roomStatus?: RoomStatus, room?: Room} {
    let rtv = this.getRoomByGameType(gameType);
    if (rtv.status === 'failure') {
      return {status: 'failure'};
    }

    if (rtv.metaRoom.already) {
      let room: Room = rtv.metaRoom.room;
      room.clientJoinRoom(new Player(playerName, socket, 'client'));
      this.roomMap.set(gameType, {already: false});
      return {status: 'success', roomStatus: 'playing', room: room};
    } else {
      let room: Room = new Room(new Player(playerName, socket), 'public');
      this.roomMap.set(gameType, {already: true, room: room});
      return {status: 'success', roomStatus: 'waiting'};
    }
    return {status: 'failure'};
  }

  leaveRoom(playerName: string, socket: Socket, gameType: GameType) {
    let rtv = this.getRoomByGameType(gameType);
    if (rtv.status === 'failure') {
      return {status: 'failure'};
    }

    if (rtv.metaRoom.already && rtv.metaRoom.room.getHostPlayer().getName() == playerName) {
      let room: Room = rtv.metaRoom.room;
      room.leaveRoom(playerName);
      this.roomMap.set(gameType, {already: false});
      return {status: 'success'};
    }
  }

  getRoomByGameType(gameType: GameType): {status: ReturnStatus, metaRoom?: MetaRoomType} {
    if (!this.roomMap.has(gameType)) {
      return {status: 'failure'};
    }
    return {status: 'success', metaRoom: this.roomMap.get(gameType)};
  }

  searchRoomByPlayerName(playerName: string): {status: ReturnStatus, room?: Room} {
    for (const [gameType, metaRoom] of this.roomMap) {
      if (metaRoom.already && metaRoom.room.isPlayer(playerName)) {
        return {status: 'success', room: metaRoom.room};
      }
    }
    return {status: 'failure'};
  }

  searchRoomByRoomId(roomId: string): {status: ReturnStatus, room?: Room} {
    for (const [gameType, metaRoom] of this.roomMap) {
      if (metaRoom.already && metaRoom.room.getRoomId() === roomId) {
        return {status: 'success', room: metaRoom.room};
      }
    }
    return {status: 'failure'};
  }

  putAllRoomStatus(): void {
    for (const [gameType, metaRoom] of this.roomMap) {
      if (metaRoom.already) {
        metaRoom.room.putRoomStatus();
      }
    }
  }
}