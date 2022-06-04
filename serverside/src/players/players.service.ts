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
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
import { CredentialPlayerDto } from './dto/credential.player.dto';

@Injectable()
export class PlayersService {
	constructor(
		@InjectRepository(PlayersRepository)
		private playersRepository: PlayersRepository,
		private jwtService: JwtService,
	) {}

	//全プレイヤー情報の取得
	async findAll(): Promise<Player[]> {
		return await this.playersRepository.find();
	}

	//特定プレイヤー情報の取得
	async findByName(name: string): Promise<Player> {
		const found = await this.playersRepository.findOne(name);
		if (!found) {
			throw new NotFoundException();
		}
		return found;
	}

	//新規プレイヤーの作成
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

	//プレイヤー情報の削除
	async deletePlayer(name: string): Promise<void> {
		const result = await this.playersRepository.delete({ name });
		if (result.affected === 0) {
			throw new NotFoundException(`Player with name "${name}" not found`);
		}
	}

	//アクセストークンの取得
	async GetAccessToken(
		credentialPlayerDto: CredentialPlayerDto,
	): Promise<{ accessToken: string }> {
		const { name, password } = credentialPlayerDto;
		const player = await this.playersRepository.findOne(name);

		if (player && (await bcrypt.compare(password, player.password))) {
			const payload = { name: player.name };
			const accessToken = await this.jwtService.sign(payload);
			return { accessToken };
		} else {
			throw new UnauthorizedException(`Check Your name and password`);
		}
	}

	//プレイヤーのログイン
	async signIn(credentialPlayerDto: CredentialPlayerDto): Promise<Player> {
		const { name, password } = credentialPlayerDto;
		const player = await this.playersRepository.findOne(name);

		//暗号化されたパスワードを照合する
		if (player && (await bcrypt.compare(password, player.password))) {
			return player;
		} else {
			throw new UnauthorizedException();
		}
	}

	//プレイヤーの表示名の更新
	async updatePlayerDisplayName(
		name: string,
		displayName: string,
	): Promise<Player> {
		const player = await this.findByName(name);
		player.displayName = displayName;
		await this.playersRepository.save(player);
		return player;
	}

	//プレイヤーのパスワードの更新
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

	//プレイヤーの画像取得URLの更新
	async updatePlayerImgUrl(name: string, imgUrl: string): Promise<Player> {
		const player = await this.findByName(name);
		player.imgUrl = imgUrl;
		await this.playersRepository.save(player);
		return player;
	}

	//プレイヤーの勝ち数の更新
	async updatePlayerWin(name: string, win: number): Promise<Player> {
		const player = await this.findByName(name);
		player.win = win;
		await this.playersRepository.save(player);
		return player;
	}

	//プレイヤーの負け数の更新
	async updatePlayerLose(name: string, lose: number): Promise<Player> {
		const player = await this.findByName(name);
		player.lose = lose;
		await this.playersRepository.save(player);
		return player;
	}

	//プレイヤーの経験値の更新
	async updatePlayerExp(name: string, exp: number): Promise<Player> {
		const player = await this.findByName(name);
		player.exp = exp;
		await this.playersRepository.save(player);
		return player;
	}

	//プレイヤーのレベルの更新
	async updatePlayerLevel(name: string, level: number): Promise<Player> {
		const player = await this.findByName(name);
		player.level = level;
		await this.playersRepository.save(player);
		return player;
	}

	//フレンドの追加
	async addFriend(name: string, friendName: string): Promise<Player> {
		const player = await this.findByName(name);
		const friend = await this.findByName(friendName);
		if (player.friends.includes(friendName)) {
			throw new ForbiddenException(
				`Friend with name "${friendName}" is already exist`,
			);
		} else if (name === friendName) {
			throw new ForbiddenException(`Cannot add yourself as a friend.`);
		} else {
			player.friends.push(friend.name);
		}
		await this.playersRepository.save(player);
		return player;
	}

	//フレンドの削除
	async deleteFriend(name: string, friendName: string): Promise<Player> {
		const player = await this.findByName(name);
		const friend = await this.findByName(friendName);
		if (!player.friends.includes(friendName)) {
			throw new ForbiddenException(
				`Friend with name "${friendName}" is not exist`,
			);
		} else {
			player.friends = player.friends.filter(
				(person) => person !== friendName,
			);
		}
		await this.playersRepository.save(player);
		return player;
	}

	//ブロックリストへの追加
	async blockFriend(name: string, friendName: string): Promise<Player> {
		const player = await this.findByName(name);
		const friend = await this.findByName(friendName);
		if (player.blockList.includes(friendName)) {
			throw new ForbiddenException(
				`Block user with name "${friendName}" is already exist`,
			);
		} else if (name === friendName) {
			throw new ForbiddenException(
				`Cannot add yourself as a block user.`,
			);
		} else {
			player.blockList.push(friend.name);
		}
		await this.playersRepository.save(player);
		return player;
	}

	//ブロックリストからの削除
	async unblockFriend(name: string, friendName: string): Promise<Player> {
		const player = await this.findByName(name);
		const friend = await this.findByName(friendName);
		if (!player.blockList.includes(friendName)) {
			throw new ForbiddenException(
				`Block user with name "${friendName}" is not exist`,
			);
		} else {
			player.blockList = player.blockList.filter(
				(person) => person !== friendName,
			);
		}
		await this.playersRepository.save(player);
		return player;
	}

	//2段階認証でsecretを設定する
	async setTwoFactorAuthenticationSecret(secret: string, name: string) {
		return this.playersRepository.update(name, {
			twoFactorAuthenticationSecret: secret,
		});
	}

	//2段階認証でQRCodeのdataURLを設定する
	async setTwoFactorAuthenticationQR(dataURL: string, name: string) {
		return this.playersRepository.update(name, {
			twoFactorAuthenticationQR: dataURL,
		});
	}

	//2段階認証をonに変更する
	async turnOnTwoFactorAuthentication(name: string) {
		return this.playersRepository.update(name, {
			isTwoFactorAuthenticationEnabled: true,
		});
	}

	//2段階認証をoffに変更する
	async turnOffTwoFactorAuthentication(name: string) {
		return this.playersRepository.update(name, {
			isTwoFactorAuthenticationEnabled: false,
		});
	}
}
