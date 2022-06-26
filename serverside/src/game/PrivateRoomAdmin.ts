import { Player } from "./Player";
import { Room } from "./Room";
import { v4 as uuidv4 } from 'uuid';


type ReturnStatus = 'success' | 'failure';

export class PrivateRoomAdmin {
  private roomList: Room [] = [];
  private roomMap: Map<String, Room> = new Map<String, Room>();

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

  joinRoom(user: string, privateKey: string) {
    ;
  }

  addPrivateRoom(user: string) {
    // let room: Room = Room(Player(), type='');
    let room: Room = this.generatePrivateRoom(user);
    let privateKey: string = this.generatePrivateKey(user);
    this.roomMap.set(privateKey, room);
    // this.roomList.push(room);
    // console.log(this.roomMap);
    return {
      status: 'success',
      privateKey: privateKey
    };
  }

  getRoomByPrivateKey(privateKey: string): Room {
    return this.roomMap[privateKey];
  }

  checkPrivateKey(privateKey: string): boolean {
    return this.roomMap.has(privateKey);
  }

  getRoomByHostUser(hostUser: string): {status: ReturnStatus, room?: Room} {
    for (const [key, room] of this.roomMap) {
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
