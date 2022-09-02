import {
	IsString,
	IsNotEmpty,
	IsBoolean,
	MaxLength,
	MinLength,
} from 'class-validator';

export class CreatePlayerDto {
	@IsString()
	@MaxLength(10)
	@IsNotEmpty()
	name: string;

	@IsString()
	//	@MinLength(6)
	@MaxLength(12)
	@IsNotEmpty()
	password: string;

	@IsString()
	@IsNotEmpty()
	imgUrl: string;

	@IsBoolean()
	@IsNotEmpty()
	ftUser: boolean;
}
