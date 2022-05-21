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
} from '@nestjs/common';
import { PlayersService } from './players.service';
import { CreatePlayerDto } from './dto/create.player.dto';
import { PlayersRepository } from './players.repository';
import { Player } from './player.entity';
import { CredentialDto } from './dto/credential.player.dto';
import { Express } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('players')
export class PlayersController {
	constructor(private playersService: PlayersService) {}

	@Get()
	async findAll(): Promise<Player[]> {
		return this.playersService.findAll();
	}

	@Get(':name')
	async findByName(@Param('name') name: string): Promise<Player> {
		return await this.playersService.findByName(name);
	}

	@Post()
	createPlayer(@Body() createPlayerDto: CreatePlayerDto): Promise<Player> {
		return this.playersService.createPlayer(createPlayerDto);
	}

	@Delete('/:name')
	deletePlayer(@Param('name') name: string): Promise<void> {
		return this.playersService.deletePlayer(name);
	}

	@Post('signin')
	signIn(@Body() credentialDto: CredentialDto): Promise<Player> {
		return this.playersService.signIn(credentialDto);
	}

	@Post('upload')
	@UseInterceptors(FileInterceptor('file'))
	uploadFile(@UploadedFile() file: Express.Multer.File) {
		console.log(file);
	}

	@Patch('/editname/:name/:displayName')
	updatePlayerDisplayName(
		@Param('name') name: string,
		@Param('displayName') displayName: string,
	): Promise<Player> {
		return this.playersService.updatePlayerDisplayName(name, displayName);
	}

	@Patch('/editpass/:name/:password')
	updatePlayerPassword(
		@Param('name') name: string,
		@Param('password') password: string,
	): Promise<Player> {
		return this.playersService.updatePlayerPassword(name, password);
	}

	@Put('/editimgurl/:name')
	updatePlayerImgUrl(
		@Param('name') name: string,
		@Body('imgUrl') imgUrl: string,
	): Promise<Player> {
		return this.playersService.updatePlayerImgUrl(name, imgUrl);
	}

	@Patch('/editwin/:name/:win')
	updatePlayerWin(
		@Param('name') name: string,
		@Param('win') win: number,
	): Promise<Player> {
		return this.playersService.updatePlayerWin(name, win);
	}

	@Patch('/editlose/:name/:lose')
	updatePlayerLose(
		@Param('name') name: string,
		@Param('lose') lose: number,
	): Promise<Player> {
		return this.playersService.updatePlayerLose(name, lose);
	}

	@Patch('/editexp/:name/:exp')
	updatePlayerExp(
		@Param('name') name: string,
		@Param('exp') exp: number,
	): Promise<Player> {
		return this.playersService.updatePlayerExp(name, exp);
	}

	@Patch('/editlevel/:name/:level')
	updatePlayerLevel(
		@Param('name') name: string,
		@Param('level') level: number,
	): Promise<Player> {
		return this.playersService.updatePlayerLevel(name, level);
	}

	@Patch('/addfriend/:name/:friendName')
	addFriend(
		@Param('name') name: string,
		@Param('friendName') friendName: string,
	): Promise<Player> {
		return this.playersService.addFriend(name, friendName);
	}

	@Delete('/deletefriend/:name/:friendName')
	deleteFriend(
		@Param('name') name: string,
		@Param('friendName') friendName: string,
	): Promise<Player> {
		return this.playersService.deleteFriend(name, friendName);
	}

	@Patch('/block/:name/:friendName')
	blockFriend(
		@Param('name') name: string,
		@Param('friendName') friendName: string,
	): Promise<Player> {
		return this.playersService.blockFriend(name, friendName);
	}

	@Delete('/unblock/:name/:friendName')
	unblockFriend(
		@Param('name') name: string,
		@Param('friendName') friendName: string,
	): Promise<Player> {
		return this.playersService.unblockFriend(name, friendName);
	}
}
