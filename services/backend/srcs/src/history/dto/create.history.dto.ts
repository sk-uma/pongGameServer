import { IsNotEmpty } from 'class-validator';

export class CreateHistoryDto {
	@IsNotEmpty()
	leftPlayer: string;

	@IsNotEmpty()
	rightPlayer: string;

	@IsNotEmpty()
	leftScore: number;

	@IsNotEmpty()
	rightScore: number;
}
