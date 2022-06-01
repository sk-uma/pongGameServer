import { Injectable } from '@nestjs/common';
import { authenticator } from 'otplib';
import { ConfigService } from '@nestjs/config';
import { toFileStream, toDataURL, toString } from 'qrcode';
import { Response } from 'express';

import { PlayersService } from '../players/players.service';
import { Player } from '../players/player.entity';

@Injectable()
export class TwoFactorAuthenticationService {
	constructor(
		private readonly configService: ConfigService,
		private readonly playersService: PlayersService,
	) {}

	//SecretとQRコードを生成してデータベースに登録する
	public async generateTwoFactorAuthenticationSecretAndQR(player: Player) {
		const secret = authenticator.generateSecret();
		const otpauthUrl = authenticator.keyuri(
			player.name,
			this.configService.get('TWO_FACTOR_AUTHENTICATION_APP_NAME'),
			secret,
		);
		await this.playersService.setTwoFactorAuthenticationSecret(
			secret,
			player.name,
		);
		await toDataURL(otpauthUrl, (err, dataURL) => {
			this.playersService.setTwoFactorAuthenticationQR(
				dataURL,
				player.name,
			);
		});
	}

	//コード入力から認証確認する
	public isTwoFactorAuthenticationCodeValid(
		twoFactorAuthenticationCode: string,
		player: Player,
	) {
		return authenticator.verify({
			token: twoFactorAuthenticationCode,
			secret: player.twoFactorAuthenticationSecret,
		});
	}
}
