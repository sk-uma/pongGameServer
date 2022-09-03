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
    // this.logger.log(data);
  }

  @SubscribeMessage('updateGameData')
  updateGameData(@MessageBody() data: any, @ConnectedSocket() client: Socket): void {
    client.broadcast.to(data?.room_id).emit('UpdateCheckedGameData', data);
  }

  @SubscribeMessage('eventGameData')
  eventGameData(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    // console.log('reply event data');
    // client.broadcast.to(data?.room_id).emit('updateEventGameData', data);
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
    // if (this.isWaiting) {
    //   // 待機がいる場合
    //   client.join(this.waitingRoomID);
    //   client.emit('opponentIsReadyToStart', {
    //     roomId: `${this.waitingRoomID}`,
    //     isServer: false
    //   });
    //   client.broadcast.to(this.waitingRoomID).emit('opponentIsReadyToStart', {
    //     roomId: `${this.waitingRoomID}`,
    //     isServer: true
    //   });
    //   // this.logger.log(`ready... ${this.waitingRoomID}`);
    //   this.isWaiting = false;
    //   this.waitingRoomID = undefined;
    // } else {
    //   // 待機がいない場合
    //   this.waitingRoomID = `room_${data?.user?.name}`;
    //   client.join(this.waitingRoomID);
    //   this.isWaiting = true;
    //   // this.logger.log(`waiting... ${this.waitingRoomID}`);
    // }
    // //クライアント接続時
    // this.logger.log(`Client connected(id, name, room_id): ${client.id} ${data?.user?.name} ${this.waitingRoomID}`);
    // // this.logger.log(this.server.sockets.manager);
    // console.log(data.user.name);
    // this.gameAdmin.tmp("tmp");
    // console.log(data);
    this.gameAdmin.joinRoom(data, client);
  }

  @SubscribeMessage('leaveRoom')
  leaveRoom(@MessageBody() data: any, @ConnectedSocket() client: Socket): void {
    // this.logger.log(`leave Room ${data.roomID}`);
    // console.log(client.rooms);
    // for (const room of client.rooms) {
    //   if (room !== client.id) {
    //     client.broadcast.to(room).emit('PlayerLeaveRoom');
    //   }
    // }
    // console.log(client.rooms);

    // console.log('receive leaceRoom!!!!!!!!!!');
    this.gameAdmin.leaveRoom(data, client);
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
    // let a = axios.get('http://localhost/history')
    //   .then((res) => console.log('成功'))
    //   .catch(error => { console.log("失敗") });
    // console.log(a);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    //クライアント切断時
    this.logger.log(`Client disconnected: ${client.id} ${client.rooms}`);
    // client.leave(this.waitingRoomID);
    // this.isWaiting = !this.isWaiting;
  }
}
