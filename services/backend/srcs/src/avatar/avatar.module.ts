import { Module } from '@nestjs/common';
import { AvatarService } from './avatar.service';
import { AvatarController } from './avatar.controller';
import { AvatarFilesRepository } from "./avatarFiles.repository";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
	imports: [TypeOrmModule.forFeature([AvatarFilesRepository])],
  providers: [AvatarService],
  controllers: [AvatarController]
})
export class AvatarModule {}
