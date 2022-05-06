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
import { AvatarFileService } from './avatarFile.service';

@Injectable()
export class PlayersService {
	constructor(
		@InjectRepository(PlayersRepository)
		private playersRepository: PlayersRepository,
	) //		private readonly avatarFileService: AvatarFileService, //		private jwtService: JwtService,
	{}

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

	//	async addAvatar(avatarname: string, imageBuffer: Buffer, filename: string) {
	//		const avatar = await this.avatarFileService.uploadAvatarFile(
	//			imageBuffer,
	//			filename,
	//		);
	//		await this.playersRepository.update(avatarname, {
	//			avatarname: avatar.avatarname,
	//		});
	//		return avatar;
	//	}
}
