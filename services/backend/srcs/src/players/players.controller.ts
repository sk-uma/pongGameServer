import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	Delete,
	Patch,
	Put,
	UseGuards,
	Req,
} from '@nestjs/common';
import { PlayersService } from './players.service';
import { CreatePlayerDto } from './dto/create.player.dto';
import { Player } from './player.entity';
import { CredentialPlayerDto } from './dto/credential.player.dto';
import { JwtAuthGuard } from './guards/jwt.auth.guards';
import RequestWithPlayer from '../two-factor-authentication/requestWithPlayer';
import { EditPlayerDto } from './dto/edit.player.dto';

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
		return request.user;
	}

	//プレイヤーのログイン
	@Post('signin')
	signIn(@Body() credentialPlayerDto: CredentialPlayerDto): Promise<Player> {
		return this.playersService.signIn(credentialPlayerDto);
	}

	//プレイヤー初期ログインフラグをオフにする
	@Patch('/editrookie/:name')
	updatePlayerNotRookie(@Param('name') name: string): Promise<Player> {
		return this.playersService.updatePlayerNotRookie(name, false);
	}

	//プレイヤーの表示名の更新
	@Post('/editname')
	updatePlayerDisplayName(
		@Body() editPlayerDto: EditPlayerDto,
	): Promise<Player> {
		return this.playersService.updatePlayerDisplayName(editPlayerDto);
	}

	//プレイヤーのパスワードの更新
	@Post('/editpass')
	updatePlayerPassword(
		@Body() editPlayerDto: EditPlayerDto,
	): Promise<Player> {
		return this.playersService.updatePlayerPassword(editPlayerDto);
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

	//プレイヤーの接続ステータスをログインに更新
	@Patch('/statuslogin/:name/')
	updateStatusLogin(@Param('name') name: string): Promise<Player> {
		return this.playersService.updateStatusLogin(name);
	}

	//プレイヤーの接続ステータスをログアウトに更新
	@Patch('/statuslogout/:name/')
	updateStatusLogout(@Param('name') name: string): Promise<Player> {
		return this.playersService.updateStatusLogout(name);
	}

	//プレイヤーの接続ステータスをログアウトに更新
	@Patch('/statusplay/:name/')
	updateStatusPlay(@Param('name') name: string): Promise<Player> {
		return this.playersService.updateStatusPlay(name);
	}

	//プレイヤーの接続ClientIdを更新
	@Patch('/updateId/:name/:clientId')
	updateClientId(
		@Param('name') name: string,
		@Param('clientId') clientId: string,
	): Promise<Player> {
		return this.playersService.updateClientId(name, clientId);
	}

	//ClientIdからプレイヤーを特定してプレイヤー情報を取得する
	@Get('/findbyclientid/:clientId')
	async findByClientId(@Param('clientId') clientId: string): Promise<Player> {
		return await this.playersService.findByClientId(clientId);
	}
}
