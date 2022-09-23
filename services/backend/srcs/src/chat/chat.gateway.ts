import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { ChatService } from './chat.service';
import { ChatAllDataType, ChatLogType } from './chat.entity';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  //private chatAdmin: ChatAdmin = chatAdmin;
  //constructor(private readonly chatRoomsRepository: ChatRoomsRepository) {}
  //constructor(
  //  @InjectRepository(ChatRoomsRepository)
  //  private chatRoomsRepository: ChatRoomsRepository,
  //) {}
  constructor(private chatService: ChatService) {}

  private chatHeader = 'Chat ';

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('ChatGateway');

  @SubscribeMessage('Chat/userConnect')
  connectedUser(client: Socket, payload: string): void {
    this.logger.log(`${this.chatHeader}: userConnect: ${payload}`);
    //this.server.emit();
    this.server.emit('Chat/recv');
  }

  @SubscribeMessage('Chat/send/chatmessage')
  async recvMessage(client: Socket, payload: ChatLogType): Promise<void> {
    this.logger.log(`Chat: recv message: room ${payload.roomId} ${client.id}`);
    this.logger.log(`Chat: recv message: owner ${payload.owner} ${client.id}`);
    this.logger.log(`Chat: recv message: text ${payload.text} ${client.id}`);
    const ret1 = await this.chatService.createLog(
      payload.roomId,
      payload.owner,
      payload.text,
      payload.type,
    );
    this.logger.log(
      `${this.chatHeader}: send chatMessage: ${payload}: ${ret1}`,
    );

    const ret: ChatAllDataType = await this.chatService.getAllData();
    await this.server.emit('Chat/recv', ret);
  }

  @SubscribeMessage('Chat/send/joinRoom')
  async joinRoom(client: Socket, payload: any): Promise<void> {
    const ret1 = await this.chatService.joinRoom(payload.roomId, payload.name);
    this.logger.log(`${this.chatHeader}: joinRoom: ${payload}: ${ret1}`);

    const ret: ChatAllDataType = await this.chatService.getAllData();
    await this.server.emit('Chat/recv', ret);
  }

  @SubscribeMessage('Chat/send/leaveRoom')
  async leaveRoom(client: Socket, payload: any): Promise<void> {
    const ret1 = await this.chatService.leaveRoom(payload.roomId, payload.name);
    this.logger.log(`${this.chatHeader}: leaveRoom: ${payload.name}: ${ret1}`);

    const ret: ChatAllDataType = await this.chatService.getAllData();
    await this.server.emit('Chat/recv', ret);
  }

  @SubscribeMessage('Chat/delete/roomMember')
  async kickRoom(client: Socket, payload: any): Promise<void> {
    const ret1 = await this.chatService.leaveRoom(
      payload.roomId,
      payload.target,
    );
    this.logger.log(
      `${this.chatHeader}: deleteRoomMember: ${payload}: ${ret1}`,
    );

    const ret: ChatAllDataType = await this.chatService.getAllData();
    //this.logger.log(ret);
    await this.server.emit('Chat/recv', ret);
  }

  @SubscribeMessage('Chat/delete/room')
  async deleteRoom(client: Socket, payload: any): Promise<void> {
    const ret1 = await this.chatService.deleteRoom(
      payload.roomId,
      payload.name,
    );
    this.logger.log(`${this.chatHeader}: deleteRoom: ${payload}: ${ret1}`);

    const ret: ChatAllDataType = await this.chatService.getAllData();
    //this.logger.log(ret);
    await this.server.emit('Chat/recv', ret);
  }

  @SubscribeMessage('Chat/generate/room')
  async createRoom(client: Socket, payload: any): Promise<void> {
    const ret1 = await this.chatService.createRoom(
      payload.roomName,
      payload.name,
      payload.roomType,
      payload.password,
    );
    this.logger.log(`${this.chatHeader}: generateRoom: ${payload}: ${ret1}`);
    const ret: ChatAllDataType = await this.chatService.getAllData();
    //this.logger.log(ret);
    await this.server.emit('Chat/recv', ret);
  }

  @SubscribeMessage('Chat/addAdmin')
  async addAdminUser(client: Socket, payload: any): Promise<void> {
    const ret1 = await this.chatService.addAdminUser(
      payload.roomId,
      payload.player,
      payload.newAdmin,
    );
    this.logger.log(`${this.chatHeader}: addAdmin: ${payload}: ${ret1}`);
    const ret: ChatAllDataType = await this.chatService.getAllData();
    //this.logger.log(ret);
    await this.server.emit('Chat/recv', ret);
  }

  @SubscribeMessage('Chat/deleteAdmin')
  async deleteAdminUser(client: Socket, payload: any): Promise<void> {
    const ret1 = await this.chatService.deleteAdminUser(
      payload.roomId,
      payload.player,
      payload.newAdmin,
    );
    this.logger.log(`${this.chatHeader}: deleteAdmin: ${payload}: ${ret1}`);
    const ret: ChatAllDataType = await this.chatService.getAllData();
    //this.logger.log(ret);
    await this.server.emit('Chat/recv', ret);
  }

  @SubscribeMessage('Chat/addBanUser')
  async addBanUser(client: Socket, payload: any): Promise<void> {
    const ret1 = await this.chatService.addBanUser(
      payload.roomId,
      payload.player,
      payload.target,
    );
    this.logger.log(`${this.chatHeader}: addBanUser: ${payload}: ${ret1}`);
    const ret: ChatAllDataType = await this.chatService.getAllData();
    //this.logger.log(ret);
    await this.server.emit('Chat/recv', ret);
  }

  @SubscribeMessage('Chat/UnbanUser')
  async UnbanUser(client: Socket, payload: any): Promise<void> {
    const ret1 = await this.chatService.UnbanUser(
      payload.roomId,
      payload.player,
      payload.target,
    );
    this.logger.log(`${this.chatHeader}: unbanUser: ${payload}: ${ret1}`);
    const ret: ChatAllDataType = await this.chatService.getAllData();
    //this.logger.log(ret);
    await this.server.emit('Chat/recv', ret);
  }

  @SubscribeMessage('Chat/addMuteUser')
  async addMuteUser(client: Socket, payload: any): Promise<void> {
    const ret1 = await this.chatService.addMuteUser(
      payload.roomId,
      payload.player,
      payload.target,
    );
    this.logger.log(`${this.chatHeader}: addMuteUser: ${payload}: ${ret1}`);
    const ret: ChatAllDataType = await this.chatService.getAllData();
    //this.logger.log(ret);
    await this.server.emit('Chat/recv', ret);
  }

  @SubscribeMessage('Chat/unmuteUser')
  async UnmuteUser(client: Socket, payload: any): Promise<void> {
    const ret1 = await this.chatService.UnmuteUser(
      payload.roomId,
      payload.player,
      payload.target,
    );
    this.logger.log(`${this.chatHeader}: unMute: ${payload}: ${ret1}`);
    const ret: ChatAllDataType = await this.chatService.getAllData();
    //this.logger.log(ret);
    await this.server.emit('Chat/recv', ret);
  }

  @SubscribeMessage('Chat/generate/DmRoom')
  async createDmRoom(client: Socket, payload: any): Promise<void> {
    const ret1 = await this.chatService.createDmRoom(
      payload.invited, //invited
      payload.name,
      payload.roomType,
      payload.password,
    );
    this.logger.log(`${this.chatHeader}: generate DmRoom: ${payload}: ${ret1}`);
    const ret: ChatAllDataType = await this.chatService.getAllData();
    //this.logger.log(ret);
    await this.server.emit('Chat/recv', ret);
  }

  @SubscribeMessage('Chat/fix/room')
  async fixRoom(client: Socket, payload: any): Promise<void> {
    const ret1 = await this.chatService.fixRoom(
      payload.roomId,
      payload.roomName,
      payload.roomType,
      payload.password,
      payload.player,
    );
    this.logger.log(`${this.chatHeader}: fixRoom: ${payload}: ${ret1}`);
    const ret: ChatAllDataType = await this.chatService.getAllData();
    //this.logger.log(ret);
    await this.server.emit('Chat/recv', ret);
  }

  @SubscribeMessage('Chat/visitRoom')
  async visitRoom(client: Socket, payload: any): Promise<void> {
    const ret1 = await this.chatService.visitRoom(
      payload.roomId,
      payload.roomName,
    );
    this.logger.log(`${this.chatHeader}: visitRoom: ${payload}: ${ret1}`);
    const ret: ChatAllDataType = await this.chatService.getAllData();
    //this.logger.log(ret);
    await this.server.emit('Chat/recv', ret);
  }

  afterInit(server: Server) {
    this.logger.log('Chat: Init');
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Chat: Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Chat: connected: ${client.id}`);
  }
}
