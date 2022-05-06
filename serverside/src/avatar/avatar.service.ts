import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { AvatarFilesRepository } from "./avatarFiles.repository";
import { Express } from "express";
import { AvatarFile } from "./avatarFile.entity";

@Injectable()
export class AvatarService {
	constructor(
		@InjectRepository(AvatarFilesRepository)
		private avatarFilesRepository: AvatarFilesRepository,
	){}
	
	async findAll(): Promise<AvatarFile[]> {
		return await this.avatarFilesRepository.find();
	}

	async findByName(name: string):Promise<AvatarFile> {
		const found = await this.avatarFilesRepository.findOne(name);
		if (!found) {
			throw new NotFoundException();
		}
		return found;
	}

	async createAvatarFile(name: string, file: Express.Multer.File): Promise<AvatarFile> {
		const found = await this.avatarFilesRepository.findOne(name);
		if (found) {
			throw new ForbiddenException(
				`AvatarFile with name "${name}" is already exist`,
			);
		}
		return this.avatarFilesRepository.createAvatarFile(name, file);
	}
}
