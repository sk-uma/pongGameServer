import { Controller, Delete, Get, HttpException, HttpStatus, Param, ParseIntPipe, Query } from '@nestjs/common';
import { gameAdmin, GameAdmin } from './GameAdmin';
import { Room } from './Room';

@Controller('game')
export class GameController {
  @Get('gameData')
  async getScoreByRoomId(
    @Query('roomId') roomId: string,
    @Query('dataType') dataType: string
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

  @Get('privateKeyStatus')
  async getPrivateKey(
    @Query('user') user: string
  ) {
    return {
      status: 'already'
    };
  }

  @Delete('privateKey')
  async deletePrivateKey(
    @Query('user') user: string
  ) {
    ;
  }

  @Get('privateKeyGen')
  async genPrivateKey(
    @Query('user') user: string,
    @Query('gameType') gameType: string,
  ) {
    return {key: ''};
  }
}
