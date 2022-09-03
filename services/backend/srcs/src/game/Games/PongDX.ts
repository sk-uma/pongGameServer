import { Socket } from "socket.io";
import { DefaultEventsMap } from "socket.io/dist/typed-events";
import { GameInterface } from "./GameInterface";


type PongDXGameData = {
  score: {
    hostPlayerScore: number;
    clientPlayerScore: number;
  }
  nextServe: 'host' | 'client';
  latestPaddlePosition: {
    host: number;
    client: number;
  }
};


export class PongDX implements GameInterface<PongDXGameData> {
  private readonly name = 'pongDX';
  private gameData: PongDXGameData;

  constructor() {
    this.gameData = {
      score: {
        hostPlayerScore: 0,
        clientPlayerScore: 0
      },
      nextServe: 'host',
      latestPaddlePosition: {
        host: -1,
        client: -1
      },
    };
  }

  getName(): string {
    return this.name;
  }

  getGameData(): PongDXGameData {
    return this.gameData;
  }

  updateGameData(data: PongDXGameData) {
    this.gameData = data;
  }

  /**
   * TODO
   */
  getGameDataByType(dataType: string): { type: string; data?: any; } {
    if (dataType === 'score') {
      return {
        type: 'score',
        data: {
          hostPlayerScore: this.gameData.score.hostPlayerScore,
          clientPlayerScore: this.gameData.score.clientPlayerScore
        }
      };
    } else {
      return {type: 'notFound'};
    }
  }

  callEvent(data: any, socket: Socket<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, any>): void {
    if (data.eventType === 'getPoint') {
      // this.gameData.score.hostPlayerScore = data.data.hostScore;
      // this.gameData.score.clientPlayerScore = data.data.clientScore;
      this.gameData = data.data;
    } else if (data.eventType === 'gameOver') {
      ;
    }
  }
}
