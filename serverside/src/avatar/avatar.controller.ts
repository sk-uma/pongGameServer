import { Controller, Get, Param, Post, Res, UseInterceptors, UploadedFile, StreamableFile } from '@nestjs/common';
import { Express, Response } from "express";
import { AvatarFile } from "./avatarFile.entity";
import { AvatarService } from "./avatar.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { Readable} from "stream";

@Controller('avatar')
export class AvatarController {
	constructor(private avatarService: AvatarService) {}

	@Get()
	async findAll(): Promise<AvatarFile[]> {
		return this.avatarService.findAll();
	}

//	@Get(':name')
//	async findByName(@Param('name') name: string): Promise<AvatarFile> {
//		return await this.avatarService.findByName(name);
//	}
//	@Get(':name')
//	async findByName(@Param('name') name: string): Promise<AvatarFile> {
//		return await this.avatarService.findByName(name);
//	}
 @Get(':name')
  async getDatabaseFileName(@Param('name') name: string, @Res({ passthrough: true }) response: Response) {
    const found = await this.avatarService.findByName(name);
 
    const stream = Readable.from(found.data);
 
    response.set({
      'Content-Disposition': `inline; filename="${found.filename}"`,
      'Content-Type': 'image'
    })
 
    return new StreamableFile(stream);
  }

	@Post(':name')
	@UseInterceptors(FileInterceptor('file'))
	createAvatarFile(@Param('name') name: string, @UploadedFile() file: Express.Multer.File): Promise<AvatarFile> {
		return this.avatarService.createAvatarFile(name, file);
	}
	

}
