import { Module } from '@nestjs/common';
import { StatusGateway } from './status.gateway';
import { PlayersModule } from '../players/players.module';

@Module({
	imports: [PlayersModule],
	providers: [StatusGateway],
})
export class StatusModule {}
