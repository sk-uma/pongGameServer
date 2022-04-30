import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class Player {
	@PrimaryColumn()
	name: string;

	@Column()
	password: string;

	@Column()
	ftUser: boolean;

	@Column()
	imgUrl: string;

	@Column()
	win: number;

	@Column()
	lose: number;

	@Column()
	level: number;

	@Column()
	exp: number;
}
