import { IsString, IsNotEmpty } from 'class-validator';

export class CredentialPlayerDto {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsString()
	@IsNotEmpty()
	password: string;
}
