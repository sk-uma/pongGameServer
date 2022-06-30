import { Socket } from "socket.io";


type ReturnStatus   = 'success' | 'failure';


export interface GameInterface<GameData> {
  getName(): string;
  getGameData(): GameData;
  getGameDataByType(dataType: string): { type: string; data?: any; }
  callEvent(data: any, socket: Socket): void;
}