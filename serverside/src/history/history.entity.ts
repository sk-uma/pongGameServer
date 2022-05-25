import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class History {
	@PrimaryGeneratedColumn()
	id: number;

	@Column()
	leftPlayer: string;

	@Column()
	rightPlayer: string;

	@Column()
	leftScore: number;

	@Column()
	rightScore: number;

	@Column()
	winner: string;

	@Column()
	loser: string;
}
