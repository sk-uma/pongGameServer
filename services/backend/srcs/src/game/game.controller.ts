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

  @Get('ckeckKey')
  async chackKey(
    @Query('key') key: string
  ) {
    let rtv = gameAdmin.getPrivateRoomAdmin().checkPrivateKey(key);
    // console.log("key", rtv);
    if (!rtv) {
      // throw new HttpException({
      //   status: HttpStatus.NOT_FOUND,
      //   error: `Invalid privateKey(${key})`
      // }, 404);
      return {status: 'notFound'};
    } else {
      return {status: 'found'};
    }
    // return ;
    // return {status: rtv.status == 'success' ? 'find' : 'notFound'};
  }

  @Delete('privateKey')
  async deletePrivateKey(
    @Query('user') user: string
  ) {
  }

  @Get('privateKeyGen')
  async genPrivateKey(
    @Query('user') user: string,
    @Query('gameType') gameType: string,
  ) {
    let rtv = gameAdmin.getPrivateRoomAdmin().addPrivateRoom(user, gameType);
    return {privateKey: rtv.privateKey};
  }

  @Get('playing-room')
  async getRoom() {
    return gameAdmin.getPlayingRoom();
  }

  @Get('player-play-status')
  async getPlayerPlayStatus(
    @Query('user') user: string
  ): Promise<{status: string, mode?: string}> {
    let rtv = gameAdmin.searchRoomByPlayerName(user);
    // if (rtv.type === 'notFound') {
    //   throw new HttpException({
    //     status: HttpStatus.NOT_FOUND,
    //     error: `Missing userName(${user})`
    //   }, 404);
    // } else {
    //   return {
    //     status: rtv.type,
    //     mode: rtv.room.getRoomInfo().gameType
    //   }
    // }
    if (rtv.type === 'notFound') {
      return {
        status: rtv.type
      }
    } else {
      return {
        status: rtv.type,
        mode: rtv.room.getRoomInfo().gameType
      }
    }

    return {status: rtv.type, mode: rtv.room.getRoomInfo().gameType};
  }

  @Get('already-generate-key')
  async checkAlreadyGenerateKey(
    @Query('user') user: string
  ) {
    let rtv = gameAdmin.getPrivateRoomAdmin().getRoomByMaster(user);
    console.log(rtv);
    return {status: rtv.status === 'success'};
  }
}
