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

	//全プレイヤーアバター情報の取得
	async findAll(): Promise<AvatarFile[]> {
		return await this.avatarFilesRepository.find();
	}

	//特定プレイヤーのアバター情報の取得
	async findByName(name: string): Promise<AvatarFile> {
		const found = await this.avatarFilesRepository.findOne(name);
		if (!found) {
			throw new NotFoundException();
		}
		return found;
	}

	//特定プレイヤーのアバター情報の削除
	async deleteAvatarFile(name: string): Promise<void> {
		const result = await this.avatarFilesRepository.delete({
			playername: name,
		});
		if (result.affected === 0) {
			throw new NotFoundException(`Player with name "${name}" not found`);
		}
	}

	//新規アバター情報の作成
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

	//アバター画像の更新
	async updateAvatarFile(
		name: string,
		file: Express.Multer.File,
	): Promise<AvatarFile> {
		return this.avatarFilesRepository.createAvatarFile(name, file);
	}
}
