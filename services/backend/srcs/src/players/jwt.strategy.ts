import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Player } from './player.entity';
import { PlayersRepository } from './players.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(private playersRepository: PlayersRepository) {
		super({
			//Requestのどの部分にJwtが記載されているか
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			//有効期限切れでエラーとする
			ignoreExpiration: false,
			secretOrKey: 'secretKey',
		});
	}

	async validate(payload: { name: string }): Promise<Player> {
		const { name } = payload;
		const player = await this.playersRepository.findOne(name);

		if (player) {
			return player;
		}
		throw new UnauthorizedException();
	}
}
