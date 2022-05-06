import { Entity, PrimaryColumn, Column, JoinColumn, OneToOne } from 'typeorm';
//import { AvatarFile } from './avatarFile.entity';

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

	@Column({
		nullable: true,
		type: 'bytea',
	})
	avatar: Uint8Array;
	//	@JoinColumn({ name: 'avatarname' })
	//	@OneToOne(() => AvatarFile, { nullable: true })
	//	avatar?: AvatarFile;
	//
	//	@Column({ nullable: true })
	//	avatarname?: string;
}
