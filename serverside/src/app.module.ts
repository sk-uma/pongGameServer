import { Module } from '@nestjs/common';
import { PlayersModule } from './players/players.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameModule } from './game/game.module';
import { AvatarModule } from './avatar/avatar.module';
import { HistoryModule } from './history/history.module';
import { TwoFactorAuthenticationModule } from './two-factor-authentication/two-factor-authentication.module';

@Module({
	imports: [
		PlayersModule,
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: 'localhost',
			port: 5432,
			username: 'postgres',
			password: 'postgres',
			database: 'backend_db',
			autoLoadEntities: true,
			synchronize: true,
		}),
		AvatarModule,
		GameModule,
		HistoryModule,
		TwoFactorAuthenticationModule,
	],
})
export class AppModule {}
