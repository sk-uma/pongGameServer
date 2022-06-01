//現状、使用していない
import { IsString, IsNotEmpty } from 'class-validator';
import { Express } from 'express';

export class CreateAvatarDto {
	@IsString()
	@IsNotEmpty()
	name: string;

	@IsNotEmpty()
	file: Express.Multer.File;
}
