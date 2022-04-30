import { IsString, IsNotEmpty } from 'class-validator';

export class CredentialDto {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsString()
	@IsNotEmpty()
	password: string;
}
