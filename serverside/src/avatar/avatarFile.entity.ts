import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class AvatarFile {
	@PrimaryColumn()
	playername: string;

	@Column()
	filename: string;

	@Column({
		type: 'bytea',
	})
	data: Uint8Array;
}

