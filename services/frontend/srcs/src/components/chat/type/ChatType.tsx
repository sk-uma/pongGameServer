export type ChatRoomType = {
  id: string;
  name: string;
  owner: string;
  admin_list: string[];
  member_list: string[];
  ban_list: string[];
  mute_list: string[];
  notVisited_list: string[];
  password: string;
  roomType: string; //public, password, dm
  //@Column()
  //LogId: string;
}

export type ChatLogType = {
  roomId: string; //roomId
  id: string; //import { v4 as uuidv4 } from 'uuid';
  owner: string;
  time: string;
  text: string; //text message || invitation id
  type: string; //message || invitation(for game)
}

export type ChatAllDataType = {
  tmp: string;
  rooms: ChatRoomType[];
  logs: ChatLogType[];
}

export {}