import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';
import { Express } from 'express';

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

	avatarFile: Express.Multer.File;
}
