import { EntityRepository, Repository } from 'typeorm';
import { AvatarFile } from './avatarFile.entity';

@EntityRepository(AvatarFile)
export class AvatarFileRepository extends Repository<AvatarFile> {}
