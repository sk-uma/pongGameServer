import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class ChatRoomType {
  @PrimaryColumn()
  id: string;
  @Column()
  name: string;
  @Column()
  owner: string;
  @Column('simple-array')
  admin_list: string[];
  @Column('simple-array')
  member_list: string[];
  @Column('simple-array')
  ban_list: string[]; //banUsers
  @Column('simple-array')
  mute_list: string[]; //muteUsers
  @Column('simple-array')
  notVisited_list: string[];
  @Column()
  password: string;
  @Column()
  roomType: string; //public, password, dm
  //@Column()
  //LogId: string;
}

@Entity()
export class ChatLogType {
  @Column()
  roomId: string; //roomId
  @PrimaryColumn()
  id: string; //import { v4 as uuidv4 } from 'uuid';
  @Column()
  owner: string;
  @Column()
  time: string;
  @Column()
  text: string; //text message || invitation room id
  @Column()
  type: string; //message || invitation(for game)
}

@Entity()
export class ChatAllDataType {
  @PrimaryColumn()
  tmp: string;
  @Column()
  rooms: ChatRoomType[];
  @Column()
  logs: ChatLogType[];
}
