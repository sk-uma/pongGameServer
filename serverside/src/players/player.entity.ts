import { Entity, PrimaryColumn, Column, OneToMany } from 'typeorm';

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

	@Column('simple-array')
	friends: string[];

	@Column('simple-array')
	blockList: string[];

	@Column({ nullable: true })
	twoFactorAuthenticationSecret?: string;

	@Column({ nullable: true })
	twoFactorAuthenticationQR?: string;

	@Column({ default: false })
	isTwoFactorAuthenticationEnabled: boolean;
}
