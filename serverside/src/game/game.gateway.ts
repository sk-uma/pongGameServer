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
  @WebSocketServer()
  server: Server;

  private logger: Logger = new Logger('GameGateway');

  @SubscribeMessage('events')
  findAll(@MessageBody() data: any): Observable<WsResponse<number>> {
    // console.log(data);
    this.logger.log('event が呼ばれました');
    return from([1, 2, 3]).pipe(map(item => ({ event: 'events', data: item })));
  }

  @SubscribeMessage('initGameData')
  initGame(@MessageBody() data: any): void {
    this.logger.log(data);
  }

  @SubscribeMessage('updateGameData')
  loopGame(@MessageBody() data: any, @ConnectedSocket() client: Socket): void {
    this.logger.log(data, `from ${client.id}`);
    // client.broadcast
    // client.broadcast.emit('UpdateCheckedGameData', {
    //   ball: {
    //     velocity: {
    //       x: data.updateGameData.ball.velocity.x,
    //       y: data.updateGameData.ball.velocity.y,
    //     },
    //     position: {
    //       x: data.updateGameData.ball.position.x,
    //       y: data.updateGameData.ball.position.y,
    //     }
    //   },
    //   opponent: {
    //     velocity: {
    //       y: data.updateGameData.player.velocity.y
    //     },
    //     position: {
    //       y: data.updateGameData.player.position.y
    //     }
    //   }
    // })
    client.broadcast.emit('UpdateCheckedGameData', `update!!!! from ${client.id}`);
  }

  afterInit(server: Server) {
    this.logger.log('初期化しました');
  }

  handleConnection(client: Socket, ...args: any[]) {
    //クライアント接続時
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(@ConnectedSocket() client: Socket) {
    //クライアント切断時
    this.logger.log(`Client disconnected: ${client.id}`);
  }
}
