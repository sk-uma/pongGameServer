import { Controller, Get, HttpException, HttpStatus, Param } from '@nestjs/common';
import { gameAdmin, GameAdmin } from './GameAdmin';
import { Room } from './Room';

@Controller('game')
export class GameController {
  @Get('gameData/:roomId/:dataType')
  async getScoreByRoomId(
    @Param('roomId') roomId: string,
    @Param('dataType') dataType: string
  ): Promise<any> {
    let rtv: any = gameAdmin.searchRoomByRoomId(roomId);
    if (rtv.type === 'notFound') {
      throw new HttpException({
        status: HttpStatus.NOT_FOUND,
        error: `Missing roomId(${roomId})`
      }, 404);
    } else {
      let data = rtv.room.getGameData(dataType);
      if (data.dataType === 'notFound') {
        throw new HttpException({
          status: HttpStatus.NOT_FOUND,
          error: `Missing roomId(${roomId})`
        }, 404);
      } else {
        return data.data;
      }
    }
    // return {clientPlayerScore: 0, hostPlayerScore: 0};
  }
}
