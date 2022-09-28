import { Controller, Get, Query } from '@nestjs/common';
import { ChatAllDataType, ChatLogType, ChatRoomType } from './chat.entity';
import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private chatService: ChatService) {}

  tmpkey = '66f7e73e-5ba5-4a00-bc76-d6153cf89e5e';

  @Get()
  getHello(@Query('name') name: string): string {
    if (name) return 'chat: controller ' + name;
    return 'chat: controller: GET() hello';
  }

  //=== controller -> service -> controller ===
  //getRooms(): void {}
  //getRoom(): void {}
  //getLogs(): void {}
  //getLog(): void {}

  @Get('getAllRooms')
  async getRooms(): Promise<ChatRoomType[]> {
    const ret = await this.chatService.getAllRooms();

    ret.sort(function (a, b) {
      return a.id > b.id ? -1 : 1;
    });
    return ret;
  }

  @Get('getAllLogs')
  getLogs(): Promise<ChatLogType[]> {
    return this.chatService.getAllLogs();
  }

  @Get('getAllData')
  async getAllData(): Promise<ChatAllDataType> {
    const ret = await this.chatService.getAllData();

    ret.rooms.sort(function (a, b) {
      return a.id > b.id ? -1 : 1;
    });
    return ret;
  }

  @Get('getRoomLog')
  getRoomLog(@Query('roomId') roomId: string): Promise<ChatLogType[]> {
    return this.chatService.getRoomLog(roomId);
  }

  @Get('getJoinedRooms')
  getJoinedRooms(@Query('userName') name: string): Promise<ChatRoomType[]> {
    return this.chatService.getJoinedRooms(name);
  }

  // --- debug ---

  @Get('createRoom')
  createRoom(
    @Query('roomName') roomName: string,
    @Query('userName') userName: string,
    @Query('password') password: string,
    @Query('roomType') roomType: string,
  ): Promise<boolean> {
    return this.chatService.createRoom(roomName, userName, roomType, password);
  }

  @Get('createLog')
  createLog(
    @Query('roomId') roomId: string,
    @Query('userName') ownerName: string,
    @Query('text') text: string,
  ): Promise<ChatLogType> {
    return this.chatService.createLog(roomId, ownerName, text, 'message');
  }

  @Get('joinRoom')
  async joinRoom(
    @Query('roomId') roomId: string,
    @Query('userName') userName: string,
  ): Promise<string> {
    const ret = await this.chatService.joinRoom(roomId, userName);
    return ret;
  }

  @Get('leaveRoom')
  leaveRoom(
    @Query('roomId') roomId: string,
    @Query('userName') userName: string,
  ): Promise<boolean> {
    return this.chatService.leaveRoom(roomId, userName);
  }

  @Get('addAdminUser')
  addAdminUser(
    @Query('roomId') roomId: string,
    @Query('player') player: string,
    @Query('newAdmin') newAdmin: string,
  ): Promise<boolean> {
    return this.chatService.addAdminUser(roomId, player, newAdmin);
  }

  @Get('visitRoom')
  visitRoom(
    @Query('roomId') roomId: string,
    @Query('userName') userName: string,
  ): Promise<string> {
    return this.chatService.visitRoom(roomId, userName);
  }

  @Get('checkPassword')
  async checkPassword(
    @Query('roomId') roomId: string,
    @Query('password') password: string,
  ): Promise<boolean> {
    return await this.chatService.checkPassword(roomId, password);
  }

  @Get('deleteRoom')
  deleteRoom(
    @Query('roomId') roomId: string,
    @Query('userName') userName: string,
    @Query('key') key: string,
  ): Promise<boolean> {
    if (this.tmpkey === key)
      return this.chatService.deleteRoom(roomId, userName);
  }

  @Get('deleteAll')
  deleteAll(@Query('key') key: string): Promise<boolean> {
    if (this.tmpkey === key) return this.chatService.deleteAll();
  }
}
