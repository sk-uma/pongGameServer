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

	//全プレイヤーアバター情報の取得
	@Get()
	async findAll(): Promise<AvatarFile[]> {
		return this.avatarService.findAll();
	}

	//特定プレイヤーのアバター情報の取得
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

	//特定プレイヤーのアバター情報の削除
	@Delete('/:name')
	deleteAvatarFile(@Param('name') name: string): Promise<void> {
		return this.avatarService.deleteAvatarFile(name);
	}

	//新規アバター情報の作成
	@Post(':name')
	@UseInterceptors(FileInterceptor('file'))
	createAvatarFile(
		@Param('name') name: string,
		@UploadedFile() file: Express.Multer.File,
	): Promise<AvatarFile> {
		return this.avatarService.createAvatarFile(name, file);
	}

	//アバター画像の更新
	@Put('/update/:name')
	@UseInterceptors(FileInterceptor('file'))
	updateAvatarFile(
		@Param('name') name: string,
		@UploadedFile() file: Express.Multer.File,
	): Promise<AvatarFile> {
		return this.avatarService.updateAvatarFile(name, file);
	}
}
