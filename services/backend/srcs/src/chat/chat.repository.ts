import { EntityRepository, Repository } from 'typeorm';
import { ChatRoomType, ChatLogType } from './chat.entity';

@EntityRepository(ChatRoomType)
export class ChatRoomsRepository extends Repository<ChatRoomType> {}

@EntityRepository(ChatLogType)
export class ChatLogRepository extends Repository<ChatLogType> {
  async chatAddLog(newLog: ChatLogType): Promise<void> {
    await this.save(newLog);
  }
}
