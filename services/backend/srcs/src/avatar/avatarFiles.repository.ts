import { EntityRepository, Repository } from 'typeorm';
import { AvatarFile } from './avatarFile.entity';
import { Express } from 'express';

@EntityRepository(AvatarFile)
export class AvatarFilesRepository extends Repository<AvatarFile> {
	async createAvatarFile(
		name: string,
		file: Express.Multer.File, //ファイル入力に対応させる
	): Promise<AvatarFile> {
		const avatarFile = this.create({
			playername: name,
			filename: file.originalname,
			data: file.buffer,
		});
		await this.save(avatarFile);
		return avatarFile;
	}
}
