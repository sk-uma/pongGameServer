import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AvatarFile } from './avatarFile.entity';

@Injectable()
export class AvatarFileService {
	constructor(
		@InjectRepository(AvatarFile)
		private avatarFileRepository: Repository<AvatarFile>,
	) {}

	async uploadAvatarFile(dataBuffer: Buffer, filename: string) {
		const newFile = await this.avatarFileRepository.create({
			filename,
			data: dataBuffer,
		});
		await this.avatarFileRepository.save(newFile);
		return newFile;
	}

	async getFileByAvatarName(avatarname: string) {
		const file = await this.avatarFileRepository.findOne(avatarname);
		if (!file) {
			throw new NotFoundException();
		}
		return file;
	}
}
