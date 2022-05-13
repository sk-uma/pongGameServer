import { Entity, PrimaryColumn, Column, JoinColumn, OneToOne } from 'typeorm';

@Entity()
export class Player {
	@PrimaryColumn()
	name: string;

	@Column()
	displayName: string;

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
