import {
	Controller,
	Get,
	Param,
	Post,
	Delete,
	Res,
	Put,
	UseInterceptors,
	UploadedFile,
	StreamableFile,
} from '@nestjs/common';
import { Express, Response } from 'express';
import { AvatarFile } from './avatarFile.entity';
import { AvatarService } from './avatar.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Readable } from 'stream';

@Controller('avatar')
export class AvatarController {
	constructor(private avatarService: AvatarService) {}

	@Get()
	async findAll(): Promise<AvatarFile[]> {
		return this.avatarService.findAll();
	}

	@Get(':name')
	async getDatabaseFileName(
		@Param('name') name: string,
		@Res({ passthrough: true }) response: Response,
	) {
		const found = await this.avatarService.findByName(name);
		const stream = Readable.from(found.data);

		response.set({
			'Content-Disposition': `inline; filename="${found.filename}"`,
			'Content-Type': 'image',
		});
		return new StreamableFile(stream);
	}

	@Delete('/:name')
	deleteAvatarFile(@Param('name') name: string): Promise<void> {
		return this.avatarService.deleteAvatarFile(name);
	}

	@Post(':name')
	@UseInterceptors(FileInterceptor('file'))
	createAvatarFile(
		@Param('name') name: string,
		@UploadedFile() file: Express.Multer.File,
	): Promise<AvatarFile> {
		return this.avatarService.createAvatarFile(name, file);
	}

	@Put('/update/:name')
	@UseInterceptors(FileInterceptor('file'))
	updateAvatarFile(
		@Param('name') name: string,
		@UploadedFile() file: Express.Multer.File,
	): Promise<AvatarFile> {
		return this.avatarService.updateAvatarFile(name, file);
	}
}
