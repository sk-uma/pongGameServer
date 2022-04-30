import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';

export class CreatePlayerDto {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsString()
	@IsNotEmpty()
	password: string;

	@IsString()
	@IsNotEmpty()
	imgUrl: string;

	@IsBoolean()
	@IsNotEmpty()
	ftUser: boolean;
}
