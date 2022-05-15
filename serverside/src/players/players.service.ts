import {
	Injectable,
	NotFoundException,
	ForbiddenException,
	UnauthorizedException,
} from '@nestjs/common';
import { CreatePlayerDto } from './dto/create.player.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PlayersRepository } from './players.repository';
import { Player } from './player.entity';
//import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
import { CredentialDto } from './dto/credential.player.dto';

@Injectable()
export class PlayersService {
	constructor(
		@InjectRepository(PlayersRepository)
		private playersRepository: PlayersRepository, //		private jwtService: JwtService,
	) {}

	async findAll(): Promise<Player[]> {
		return await this.playersRepository.find();
	}

	async findByName(name: string): Promise<Player> {
		const found = await this.playersRepository.findOne(name);
		if (!found) {
			throw new NotFoundException();
		}
		return found;
	}

	async createPlayer(createPlayerDto: CreatePlayerDto): Promise<Player> {
		const found = await this.playersRepository.findOne({
			name: createPlayerDto.name,
		});
		if (found) {
			throw new ForbiddenException(
				`Player with name ${createPlayerDto.name}" is already exist`,
			);
		}
		return this.playersRepository.createPlayer(createPlayerDto);
	}

	async deletePlayer(name: string): Promise<void> {
		const result = await this.playersRepository.delete({ name });
		if (result.affected === 0) {
			throw new NotFoundException(`Player with name "${name}" not found`);
		}
	}

	async signIn(credentialDto: CredentialDto): Promise<Player> {
		const { name, password } = credentialDto;
		const player = await this.playersRepository.findOne(name);

		if (player && (await bcrypt.compare(password, player.password))) {
			return player;
		} else {
			throw new UnauthorizedException();
		}
	}

	async updatePlayerDisplayName(
		name: string,
		displayName: string,
	): Promise<Player> {
		const player = await this.findByName(name);
		player.displayName = displayName;
		await this.playersRepository.save(player);
		return player;
	}

	async updatePlayerPassword(
		name: string,
		password: string,
	): Promise<Player> {
		const salt = await bcrypt.genSalt();
		const hashPassword = await bcrypt.hash(password, salt);
		const player = await this.findByName(name);
		player.password = hashPassword;
		await this.playersRepository.save(player);
		return player;
	}

	async updatePlayerImgUrl(name: string, imgUrl: string): Promise<Player> {
		const player = await this.findByName(name);
		player.imgUrl = imgUrl;
		await this.playersRepository.save(player);
		return player;
	}

	async updatePlayerWin(name: string, win: number): Promise<Player> {
		const player = await this.findByName(name);
		player.win = win;
		await this.playersRepository.save(player);
		return player;
	}

	async updatePlayerLose(name: string, lose: number): Promise<Player> {
		const player = await this.findByName(name);
		player.lose = lose;
		await this.playersRepository.save(player);
		return player;
	}

	async updatePlayerExp(name: string, exp: number): Promise<Player> {
		const player = await this.findByName(name);
		player.exp = exp;
		await this.playersRepository.save(player);
		return player;
	}

	async updatePlayerLevel(name: string, level: number): Promise<Player> {
		const player = await this.findByName(name);
		player.level = level;
		await this.playersRepository.save(player);
		return player;
	}
}
