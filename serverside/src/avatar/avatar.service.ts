import {
	Injectable,
	NotFoundException,
	ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AvatarFilesRepository } from './avatarFiles.repository';
import { Express } from 'express';
import { AvatarFile } from './avatarFile.entity';

@Injectable()
export class AvatarService {
	constructor(
		@InjectRepository(AvatarFilesRepository)
		private avatarFilesRepository: AvatarFilesRepository,
	) {}

	async findAll(): Promise<AvatarFile[]> {
		return await this.avatarFilesRepository.find();
	}

	async findByName(name: string): Promise<AvatarFile> {
		const found = await this.avatarFilesRepository.findOne(name);
		if (!found) {
			throw new NotFoundException();
		}
		return found;
	}

	async deleteAvatarFile(name: string): Promise<void> {
		const result = await this.avatarFilesRepository.delete({
			playername: name,
		});
		if (result.affected === 0) {
			throw new NotFoundException(`Player with name "${name}" not found`);
		}
	}

	async createAvatarFile(
		name: string,
		file: Express.Multer.File,
	): Promise<AvatarFile> {
		const found = await this.avatarFilesRepository.findOne(name);
		if (found) {
			throw new ForbiddenException(
				`AvatarFile with name "${name}" is already exist`,
			);
		}
		return this.avatarFilesRepository.createAvatarFile(name, file);
	}

	async updateAvatarFile(
		name: string,
		file: Express.Multer.File,
	): Promise<AvatarFile> {
		return this.avatarFilesRepository.createAvatarFile(name, file);
	}
}
