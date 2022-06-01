import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	Delete,
	Patch,
	Put,
	ParseUUIDPipe,
	UseInterceptors,
	UploadedFile,
	UseGuards,
	Req,
} from '@nestjs/common';
import { PlayersService } from './players.service';
import { CreatePlayerDto } from './dto/create.player.dto';
import { PlayersRepository } from './players.repository';
import { Player } from './player.entity';
import { CredentialPlayerDto } from './dto/credential.player.dto';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from './guards/jwt.auth.guards';
import RequestWithPlayer from '../two-factor-authentication/requestWithPlayer';

@Controller('players')
export class PlayersController {
	constructor(private playersService: PlayersService) {}

	//全プレイヤー情報の取得
	@Get()
	//	@UseGuards(JwtAuthGuard)
	async findAll(): Promise<Player[]> {
		return this.playersService.findAll();
	}

	//特定プレイヤー情報の取得
	@Get(':name')
	async findByName(@Param('name') name: string): Promise<Player> {
		return await this.playersService.findByName(name);
	}

	//新規プレイヤーの作成
	@Post()
	createPlayer(@Body() createPlayerDto: CreatePlayerDto): Promise<Player> {
		return this.playersService.createPlayer(createPlayerDto);
	}

	//プレイヤー情報の削除
	@Delete('/:name')
	deletePlayer(@Param('name') name: string): Promise<void> {
		return this.playersService.deletePlayer(name);
	}

	//アクセストークンの取得
	@Post('token')
	GetAccessToken(
		@Body() credentialPlayerDto: CredentialPlayerDto,
	): Promise<{ accessToken: string }> {
		return this.playersService.GetAccessToken(credentialPlayerDto);
	}

	//アクセストークンによるプレイヤー情報の取得
	@Post('bytoken')
	@UseGuards(JwtAuthGuard)
	FindByToken(@Req() request: RequestWithPlayer) {
		console.log(request.user);
		return request.user;
	}

	//プレイヤーのログイン
	@Post('signin')
	signIn(@Body() credentialPlayerDto: CredentialPlayerDto): Promise<Player> {
		return this.playersService.signIn(credentialPlayerDto);
	}

	//	@Post('upload')
	//	@UseInterceptors(FileInterceptor('file'))
	//	uploadFile(@UploadedFile() file: Express.Multer.File) {
	//		console.log(file);
	//	}

	//プレイヤーの表示名の更新
	@Patch('/editname/:name/:displayName')
	updatePlayerDisplayName(
		@Param('name') name: string,
		@Param('displayName') displayName: string,
	): Promise<Player> {
		return this.playersService.updatePlayerDisplayName(name, displayName);
	}

	//プレイヤーのパスワードの更新
	@Patch('/editpass/:name/:password')
	updatePlayerPassword(
		@Param('name') name: string,
		@Param('password') password: string,
	): Promise<Player> {
		return this.playersService.updatePlayerPassword(name, password);
	}

	//プレイヤーの画像取得URLの更新
	@Put('/editimgurl/:name')
	updatePlayerImgUrl(
		@Param('name') name: string,
		@Body('imgUrl') imgUrl: string,
	): Promise<Player> {
		return this.playersService.updatePlayerImgUrl(name, imgUrl);
	}

	//プレイヤーの勝ち数の更新
	@Patch('/editwin/:name/:win')
	updatePlayerWin(
		@Param('name') name: string,
		@Param('win') win: number,
	): Promise<Player> {
		return this.playersService.updatePlayerWin(name, win);
	}

	//プレイヤーの負け数の更新
	@Patch('/editlose/:name/:lose')
	updatePlayerLose(
		@Param('name') name: string,
		@Param('lose') lose: number,
	): Promise<Player> {
		return this.playersService.updatePlayerLose(name, lose);
	}

	//プレイヤーの経験値の更新
	@Patch('/editexp/:name/:exp')
	updatePlayerExp(
		@Param('name') name: string,
		@Param('exp') exp: number,
	): Promise<Player> {
		return this.playersService.updatePlayerExp(name, exp);
	}

	//プレイヤーのレベルの更新
	@Patch('/editlevel/:name/:level')
	updatePlayerLevel(
		@Param('name') name: string,
		@Param('level') level: number,
	): Promise<Player> {
		return this.playersService.updatePlayerLevel(name, level);
	}

	//フレンドの追加
	@Patch('/addfriend/:name/:friendName')
	addFriend(
		@Param('name') name: string,
		@Param('friendName') friendName: string,
	): Promise<Player> {
		return this.playersService.addFriend(name, friendName);
	}

	//フレンドの削除
	@Delete('/deletefriend/:name/:friendName')
	deleteFriend(
		@Param('name') name: string,
		@Param('friendName') friendName: string,
	): Promise<Player> {
		return this.playersService.deleteFriend(name, friendName);
	}

	//ブロックリストへの追加
	@Patch('/block/:name/:friendName')
	blockFriend(
		@Param('name') name: string,
		@Param('friendName') friendName: string,
	): Promise<Player> {
		return this.playersService.blockFriend(name, friendName);
	}

	//ブロックリストからの削除
	@Delete('/unblock/:name/:friendName')
	unblockFriend(
		@Param('name') name: string,
		@Param('friendName') friendName: string,
	): Promise<Player> {
		return this.playersService.unblockFriend(name, friendName);
	}
}
