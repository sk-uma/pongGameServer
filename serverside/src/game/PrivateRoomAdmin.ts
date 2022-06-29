import { Player } from "./Player";
import { Room } from "./Room";
import { v4 as uuidv4 } from 'uuid';
import { Socket } from "socket.io";


type ReturnStatus   = 'success' | 'failure';
type RoomStatus     = 'playing' | 'waiting' | 'leaved';
type RoomMetaStatus = 'masterOnly' | 'slaveOnly' | 'nothing';
type MetaRoomType   = {
  status: RoomMetaStatus;
  master: string;
  room?: Room;
}


export class PrivateRoomAdmin {
  private roomList: Room [] = [];
  private roomMap: Map<String, MetaRoomType> = new Map<String, MetaRoomType>();

  constructor() {
  }

  addRoom(room: Room): void {
    this.roomList.push(room);
  }

  removeRoomById(): void {
    ;
  }

  getRoomById(): {statusCode: string, room?: Room} {
    return ;
  }

  getRoomByPlayerName(): {statusCode: string, room?: Room} {
    return ;
  }

  joinRoom(playerName: string, socket: Socket, privateKey: string): {status: ReturnStatus, roomStatus?: RoomStatus, room?: Room} {
    let rtv: {status: ReturnStatus, metaRoom?: MetaRoomType} = this.getRoomByPrivateKey(privateKey);
    if (rtv.status === 'failure') {
      return {status: 'failure'}
    }
    // console.log('roomdata:', this.roomMap);
    // console.log('roomdata:', this.roomMap.get(privateKey));
    if (rtv.metaRoom.status === 'nothing') {
      let roomMetaStatus: RoomMetaStatus;
      if (rtv.metaRoom.master === playerName) {
        roomMetaStatus = 'masterOnly';
      } else {
        roomMetaStatus = 'slaveOnly';
      }
      let room: Room = new Room(new Player(playerName, socket));
      this.roomMap.set(privateKey, {status: roomMetaStatus, master: rtv.metaRoom.master, room: room});
      return {status: 'success', roomStatus: 'waiting', room: this.roomMap.get(privateKey).room};
    } else if (rtv.metaRoom.status === 'masterOnly' || (rtv.metaRoom.status === 'slaveOnly' && rtv.metaRoom.master === playerName)) {
      this.roomMap.get(privateKey).room.clientJoinRoom(new Player(playerName, socket, 'client'));
      let room: Room = this.roomMap.get(privateKey).room;
      this.roomMap.delete(privateKey);
      return {status: 'success', roomStatus: 'playing', room: room};
    }
    return {status: 'failure'};

    // if (rtv.room.getStatus() === 'leaved') {
    //   let roomMetaStatus: RoomMetaStatus;
    //   if (rtv.room.getHostPlayer().getName() === playerName) {
    //     // rtv.room.reJoinRoom(playerName, socket);
    //     roomMetaStatus = 'masterOnly';
    //   } else if (rtv.room.getClientPlayer().getName() === playerName) {
    //     // rtv.room.clientJoinRoom(new Player(playerName, socket, 'client'));
    //     roomMetaStatus = 'slaveOnly';
    //   } else {
    //     return {status: 'failure'};
    //   }
    //   rtv.room.setStatus('waiting');
    //   return {status: 'success', roomStatus: 'waiting'};
    // } else if (rtv.room.getStatus() === 'waiting') {
    //   if (rtv.room.getHostPlayer().getName() === playerName) {
    //     rtv.room.reJoinRoom(playerName, socket);
    //   } else if (rtv.room.getClientPlayer().getName() === playerName) {
    //     rtv.room.clientJoinRoom(new Player(playerName, socket, 'client'));
    //   } else {
    //     return {status: 'failure'};
    //   }
    //   rtv.room.setStatus('playing');
    //   return {status: 'success', roomStatus: 'playing'};
    // } else {
    //   return {status: 'failure'};
    // }
  }

  addPrivateRoom(user: string) {
    // let room: Room = Room(Player(), type='');
    // let room: Room = this.generatePrivateRoom(user);
    let privateKey: string = this.generatePrivateKey(user);
    this.roomMap.set(privateKey, {status: 'nothing', master: user});
    // this.roomList.push(room);
    // console.log(this.roomMap);
    return {
      status: 'success',
      privateKey: privateKey
    };
  }

  getRoomByPrivateKey(privateKey: string): {status: ReturnStatus, metaRoom?: MetaRoomType} {
    if (!this.checkPrivateKey(privateKey)) {
      return {status: 'failure'}
    }
    return {status: 'success', metaRoom: this.roomMap.get(privateKey)};
  }

  checkPrivateKey(privateKey: string): boolean {
    return this.roomMap.has(privateKey);
  }

  getRoomByHostUser(hostUser: string): {status: ReturnStatus, room?: Room} {
    for (const [key, roomData] of this.roomMap) {
      let room: Room = roomData.room;
      if (room.getHostPlayer().getName() === hostUser) {
        return {status: 'success', room};
      }
    }
    return {status: 'failure'};
  }

  private generatePrivateKey(user: string): string {
    return uuidv4();
  }

  private generatePrivateRoom(user: string): Room {
    let player: Player = new Player(user, undefined, 'host');
    player.setStatus('disconnected');
    let room: Room = new Room(player, 'private');
    room.setStatus('leaved');
    return room;
    // let room: Room = Room();
  }
}
