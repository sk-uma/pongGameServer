import { Entity, PrimaryColumn, Column } from 'typeorm';

@Entity()
export class AvatarFile {
	@PrimaryColumn()
	playername: string;

	@Column()
	filename: string;

	//画像バイナリデータ用
	@Column({
		type: 'bytea',
	})
	data: Uint8Array;
}
