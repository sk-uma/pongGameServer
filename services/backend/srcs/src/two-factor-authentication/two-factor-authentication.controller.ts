import {
	Controller,
	UseInterceptors,
	UseGuards,
	ClassSerializerInterceptor,
	Post,
	Res,
	Req,
	HttpCode,
	Body,
	UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { TwoFactorAuthenticationService } from './two-factor-authentication.service';
import { JwtAuthGuard } from '../players/guards/jwt.auth.guards';
import RequestWithPlayer from './requestWithPlayer';
import { PlayersService } from '../players/players.service';
import { TwoFactorAuthenticationCodeDto } from './dto/two-factor-authenticationCode.dto';

@Controller('2fa')
@UseInterceptors(ClassSerializerInterceptor)
export class TwoFactorAuthenticationController {
	constructor(
		private readonly twoFactorAuthenticationService: TwoFactorAuthenticationService,
		private readonly playersService: PlayersService,
	) {}

	//SecretとQRコードを生成してデータベースに登録する
	@Post('create')
	@HttpCode(200)
	@UseGuards(JwtAuthGuard)
	async createSecretAndQR(@Req() request: RequestWithPlayer) {
		await this.twoFactorAuthenticationService.generateTwoFactorAuthenticationSecretAndQR(
			request.user,
		);
	}

	//コードで認証確認ができたとき、二要素認証をオンにする
	@Post('turnon')
	@HttpCode(200)
	@UseGuards(JwtAuthGuard)
	async turnOnTwoFactorAuthentication(
		@Req() request: RequestWithPlayer,
		@Body() { twoFactorAuthenticationCode }: TwoFactorAuthenticationCodeDto,
	) {
		const isCodeValid =
			this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
				twoFactorAuthenticationCode,
				request.user,
			);
		if (!isCodeValid) {
			throw new UnauthorizedException('Wrong authentication code');
		}
		await this.playersService.turnOnTwoFactorAuthentication(
			request.user.name,
		);
	}

	//コードで認証確認ができたとき、二要素認証をオフにする
	@Post('turnoff')
	@HttpCode(200)
	@UseGuards(JwtAuthGuard)
	async turnOffTwoFactorAuthentication(
		@Req() request: RequestWithPlayer,
		@Body() { twoFactorAuthenticationCode }: TwoFactorAuthenticationCodeDto,
	) {
		const isCodeValid =
			this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
				twoFactorAuthenticationCode,
				request.user,
			);
		if (!isCodeValid) {
			throw new UnauthorizedException('Wrong authentication code');
		}
		await this.playersService.turnOffTwoFactorAuthentication(
			request.user.name,
		);
	}

	//コードで認証確認ができたとき、Status200を返す
	@Post('authenticate')
	@HttpCode(200)
	@UseGuards(JwtAuthGuard)
	async authenticate(
		@Req() request: RequestWithPlayer,
		@Body() { twoFactorAuthenticationCode }: TwoFactorAuthenticationCodeDto,
	) {
		const isCodeValid =
			this.twoFactorAuthenticationService.isTwoFactorAuthenticationCodeValid(
				twoFactorAuthenticationCode,
				request.user,
			);
		if (!isCodeValid) {
			throw new UnauthorizedException('Wrong authentication code');
		}
	}
}
