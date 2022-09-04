import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
  ConnectedSocket,
} from '@nestjs/websockets';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common'
import { GameAdmin, gameAdmin } from './GameAdmin';
import axios from 'axios';

interface InitGameData {
  playerName: string;
  ball: {
    velocity: {
      x: number;
      y: number;
    };
  };
  time: any
}

interface UpdateGameData {
  playerName: string;
  ball: {
    velocity: {
      x: number | undefined;
      y: number | undefined;
    };
    position: {
      x: number | undefined;
      y: number | undefined;
    }
  };
  player: {
    velocity: {
      x?: number | undefined;
      y: number | undefined;
    };
    position: {
      x?: number | undefined;
      y: number | undefined;
    }
  }
  time: any
}

@WebSocketGateway(
  {
    cors: {
      origin: '*',
    },
  }
)
export class GameGateway {
  private isWaiting = false;
  private waitingRoomID: string;
  private gameAdmin: GameAdmin = gameAdmin;

  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('GameGateway');

  @SubscribeMessage('events')
  findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
    this.logger.log('event が呼ばれました');
    return from([1, 2, 3]).pipe(map(item => ({ event: 'events', data: item })));
  }

  @SubscribeMessage('initGameData')
  initGame(@MessageBody() data: any): void {
  }

  @SubscribeMessage('updateGameData')
  updateGameData(@MessageBody() data: any, @ConnectedSocket() client: Socket): void {
    client.broadcast.to(data?.room_id).emit('UpdateCheckedGameData', data);
  }

  @SubscribeMessage('eventGameData')
  eventGameData(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    for (const room of client.rooms) {
      if (room !== client.id) {
        client.broadcast.to(room).emit('updateEventGameData', data);
      }
    }
    this.gameAdmin.eventGameData(data, client);
  }

  afterInit(server: Server) {
    this.logger.log('初期化しました');
  }

  @SubscribeMessage('joinRoom')
  joinRoom(@MessageBody() data: any, @ConnectedSocket() client: Socket): void {
    this.gameAdmin.joinRoom(data, client);
  }

  @SubscribeMessage('leaveRoom')
  leaveRoom(@MessageBody() data: any, @ConnectedSocket() client: Socket): void {
    this.gameAdmin.leaveRoom(data, client);
    client.disconnect();
  }

  @SubscribeMessage('hello')
  hello(@MessageBody() data: any, @ConnectedSocket() client: Socket): void {
    this.logger.log(`receive hello message number=${data} !!!!!!!!!!!!!!`);
    // if (data === 999) {
    //   client.disconnect();
    // }
  }

  @SubscribeMessage('startWatching')
  startWatching(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    this.gameAdmin.startWatching(data, client);
  }

  @SubscribeMessage('finishWatching')
  finishWatching(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    this.gameAdmin.finishWatching(data, client);
  }

  handleConnection(client: Socket, ...args: any[]) {
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    //クライアント切断時
    this.logger.log(`Client disconnected: ${client.id} ${client.rooms}`);
  }
}
