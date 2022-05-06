import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	Delete,
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
}
