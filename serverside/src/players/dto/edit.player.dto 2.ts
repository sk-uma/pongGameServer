import {
	IsString,
	IsNotEmpty,
	MaxLength,
	MinLength,
	IsOptional,
} from 'class-validator';

export class EditPlayerDto {
	@IsString()
	@IsNotEmpty()
	@MaxLength(10)
	name: string;

	@IsString()
	@MaxLength(10)
	@IsOptional()
	displayName: string;

	@IsString()
	//	@MinLength(6)
	@MaxLength(12)
	@IsOptional()
	password: string;
}
