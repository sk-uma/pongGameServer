import { IsString, IsNotEmpty } from 'class-validator';

export class TwoFactorAuthenticationCodeDto {
	@IsString()
	@IsNotEmpty()
	twoFactorAuthenticationCode: string;
}
