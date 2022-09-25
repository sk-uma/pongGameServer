import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ChatLogType, ChatRoomType, ChatAllDataType } from './chat.entity';
import { v4 as uuidv4 } from 'uuid';
import { ChatLogRepository, ChatRoomsRepository } from './chat.repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatRoomsRepository)
    public chatRoomsRepository: ChatRoomsRepository,

    @InjectRepository(ChatLogRepository)
    public chatLogRepository: ChatLogRepository,
  ) {}

  //=== controller -> service -> controller ===
  //getRooms(): void {}
  //getRoom(): void {}
  //getLogs(): void {}
  //getRoomLog(): void {}
  //getLog(): void {}
  //=== gateway -> service -> gateway ===
  //createRoom(): void {}
  //createLog(): void {}
  //joinRoom(): void {}
  //leaveRoom(): void {}
  //deleteRoom(): void {}
  //changeRoomType(): void {}
  //addAuther?(): void {}

  //--- from controller ---
  async getAllRooms(): Promise<ChatRoomType[]> {
    return await this.chatRoomsRepository.find();
  }

  async getAllLogs(): Promise<ChatLogType[]> {
    return await this.chatLogRepository.find();
  }

  async getAllData(): Promise<ChatAllDataType> {
    const retData: ChatAllDataType = {
      tmp: 'true',
      logs: await this.chatLogRepository.find(),
      rooms: await this.chatRoomsRepository.find(),
    };
    return retData;
  }

  async getRoomLog(roomId: string): Promise<ChatLogType[]> {
    const Logs = await this.chatLogRepository.find();
    const retLogs = Logs.filter((item) => item.roomId === roomId);
    return retLogs;
  }

  async getJoinedRooms(userName: string): Promise<ChatRoomType[]> {
    const rooms = await this.chatRoomsRepository.find();
    const retRooms = rooms.filter(
      (item) => item.member_list.includes(userName),
      //item.id !== userName,
    );
    return retRooms;
  }

  //--- from gateway ---
  async createRoom(
    roomName: string,
    ownerName: string,
    roomType: string,
    password: string,
  ): Promise<boolean> {
    //bcryptでパスワードを暗号化する。saltはhash化するときに付加する文字列
    const salt = await bcrypt.genSalt();
    let hashPassword = '';
    if (password !== '') hashPassword = await bcrypt.hash(password, salt);
    const newRoom: ChatRoomType = {
      id: uuidv4(),
      name: roomName,
      owner: ownerName,
      admin_list: [],
      member_list: [],
      ban_list: [],
      mute_list: [],
      notVisited_list: [],
      password: hashPassword,
      roomType: roomType,
    };
    newRoom.member_list.push(ownerName);
    newRoom.admin_list.push(ownerName);
    const ret = await this.chatRoomsRepository.save(newRoom);
    return ret ? true : false;
  }

  async createDmRoom(
    invited: string, //invited
    ownerName: string,
    roomType: string,
    password: string,
  ): Promise<boolean> {
    const newRoom: ChatRoomType = {
      id: uuidv4(),
      name: invited + '+' + ownerName,
      owner: ownerName,
      admin_list: [],
      member_list: [],
      ban_list: [],
      mute_list: [],
      notVisited_list: [],
      password: password,
      roomType: roomType,
    };
    newRoom.admin_list.push(invited);
    newRoom.admin_list.push(ownerName);
    newRoom.member_list.push(invited);
    newRoom.member_list.push(ownerName);
    newRoom.notVisited_list.push(invited);

    const ret = await this.chatRoomsRepository.save(newRoom);
    return ret ? true : false;
  }

  async createLog(
    roomId: string,
    ownerName: string,
    text: string,
    type: string,
  ): Promise<string> {
    //user check
    const room = await this.chatRoomsRepository.findOne(roomId);
    if (!room) return 'not valid roomId';
    if (!room.member_list.includes(ownerName)) return 'not valid user';
    const newLog: ChatLogType = {
      roomId: roomId, //roomId
      id: uuidv4(), //import { v4 as uuidv4 } from 'uuid';
      owner: ownerName,
      time: new Date().toISOString(),
      text: text,
      type: type,
    };

    //update room
    room.notVisited_list = room.member_list;
    await this.chatRoomsRepository.save(room);

    const ret = await this.chatLogRepository.save(newLog);
    return ret ? 'Add' : 'false';
  }

  async joinRoom(roomId: string, player: string): Promise<string> {
    const retStr = 'Chat: joinRoom: false';
    const room = await this.chatRoomsRepository.findOne(roomId);
    if (!room) return `${retStr} false: findOne`;
    const tmp = room.member_list.find((item) => item === player);
    if (tmp) return `${retStr} false: already join`;
    if (room.ban_list.includes(player)) return `${retStr}: false: banned`;
    room.member_list.push(player);
    const ret = await this.chatRoomsRepository.save(room);
    return ret ? `${retStr}: success` : `${retStr}: false: save `;
  }

  async leaveRoom(roomId: string, player: string): Promise<boolean> {
    const room = await this.chatRoomsRepository.findOne(roomId);
    if (!room) return false;
    if (room.owner === player) {
      //delete log
      await this.chatLogRepository.delete({ roomId: roomId });
      //delete room
      await this.chatRoomsRepository.remove(room);
      return true;
    }
    const newParticipant = room.member_list.filter((item) => item !== player);
    const newAdmins = room.admin_list.filter((item) => item !== player);
    room.member_list = newParticipant;
    room.admin_list = newAdmins;
    await this.chatRoomsRepository.save(room);
    return true;
  }

  async addAdminUser(
    roomId: string,
    player: string,
    newAdmin: string,
  ): Promise<boolean> {
    const room = await this.chatRoomsRepository.findOne(roomId);
    if (!room) return false;
    if (room.owner !== player && !room.admin_list.includes(player))
      return false;
    if (!room.member_list.includes(newAdmin)) return false;
    if (room.admin_list.includes(newAdmin)) return false;

    room.admin_list.push(newAdmin);
    await this.chatRoomsRepository.save(room);
    return true;
  }

  async deleteAdminUser(
    roomId: string,
    player: string,
    newAdmin: string,
  ): Promise<string> {
    const ret = 'Chat: deleteAdmin: ';
    const room = await this.chatRoomsRepository.findOne(roomId);
    if (!room) return `${ret} false: findOne`;
    if (room.owner !== player) return `${ret} false: not owner`;
    if (!room.admin_list.includes(newAdmin)) return `${ret} false`;

    const newAdminList = room.admin_list.filter((item) => item !== newAdmin);
    room.admin_list = newAdminList;
    await this.chatRoomsRepository.save(room);
    return `${ret} true`;
  }

  async addBanUser(
    roomId: string,
    player: string,
    target: string,
  ): Promise<string> {
    const room = await this.chatRoomsRepository.findOne(roomId);
    if (!room) return 'false: findOne';
    if (room.owner !== player && !room.admin_list.includes(player))
      return 'false: not admins';
    if (room.ban_list.includes(target)) return 'false: already set';
    //if (room.admins.includes(player)) return 'false: target is admin';

    room.ban_list.push(target);
    await this.chatRoomsRepository.save(room);
    return 'success';
  }

  async UnbanUser(
    roomId: string,
    player: string,
    target: string,
  ): Promise<string> {
    const room = await this.chatRoomsRepository.findOne(roomId);
    if (!room) return 'false: findOne';
    if (room.owner !== player && !room.admin_list.includes(player))
      return 'false: not admins';
    if (!room.ban_list.includes(target)) return 'false: already unban';
    //if (room.admins.includes(player)) return 'false: target is admin';

    const newBanList = room.ban_list.filter((item) => item !== target);
    room.ban_list = newBanList;

    await this.chatRoomsRepository.save(room);
    return 'success';
  }

  async addMuteUser(
    roomId: string,
    player: string,
    target: string,
  ): Promise<string> {
    const room = await this.chatRoomsRepository.findOne(roomId);
    if (!room) return 'false: findOne';
    if (room.owner !== player && !room.admin_list.includes(player))
      return 'false: not admins';
    if (room.mute_list.includes(target)) return 'false: already set';
    //if (room.admins.includes(player)) return 'false: target is admin';

    room.mute_list.push(target);
    await this.chatRoomsRepository.save(room);
    return 'success';
  }

  async UnmuteUser(
    roomId: string,
    player: string,
    target: string,
  ): Promise<string> {
    const room = await this.chatRoomsRepository.findOne(roomId);
    if (!room) return 'false: findOne';
    if (room.owner !== player && !room.admin_list.includes(player))
      return 'false: not admins';
    if (!room.mute_list.includes(target)) return 'false: already unban';
    //if (room.admins.includes(player)) return 'false: target is admin';

    const newMuteList = room.mute_list.filter((item) => item !== target);
    room.mute_list = newMuteList;

    await this.chatRoomsRepository.save(room);
    return 'success';
  }

  async fixRoom(
    roomId: string,
    roomName: string,
    roomType: string,
    password: string,
    player: string,
  ): Promise<boolean> {
    const room = await this.chatRoomsRepository.findOne(roomId);
    if (!room) return false;
    //if (room.owner !== player && !room.admins.includes(player)) return false;

    //room.id = roomId;
    room.name = roomName;
    room.roomType = roomType;
    if (room.password !== password && password !== '') {
      const salt = await bcrypt.genSalt();
      const hashPassword = await bcrypt.hash(password, salt);
      room.password = hashPassword;
    }
    await this.chatRoomsRepository.save(room);
    return true;
  }

  async visitRoom(roomId: string, userName: string): Promise<string> {
    const room = await this.chatRoomsRepository.findOne(roomId);
    if (!room) return 'findOne';

    const newList = room.notVisited_list.filter((item) => item !== userName);
    room.notVisited_list = newList;
    await this.chatRoomsRepository.save(room);
    return 'success';
  }

  //delete user
  //deleteAdminUser
  //kickUser
  async checkPassword(roomId: string, password: string): Promise<boolean> {
    const room = await this.chatRoomsRepository.findOne(roomId);
    if (!room) return false;
    if (await bcrypt.compare(password, room.password)) return true;
    return false;
  }

  async deleteRoom(roomId: string, userName: string): Promise<boolean> {
    const room = await this.chatRoomsRepository.findOne(roomId);
    if (!room) return false;
    if (room.owner !== userName) return false;
    //delete log
    await this.chatLogRepository.delete({ roomId: roomId });
    //delete room
    await this.chatRoomsRepository.remove(room);
    return true;
  }

  async deleteAll(): Promise<boolean> {
    await this.chatRoomsRepository.clear();
    await this.chatLogRepository.clear();
    return true;
  }
}
