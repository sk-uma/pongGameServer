import { Module } from '@nestjs/common';
import { PlayersModule } from './players/players.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameModule } from './game/game.module';
import { AvatarModule } from './avatar/avatar.module';
import { HistoryModule } from './history/history.module';
import { TwoFactorAuthenticationModule } from './two-factor-authentication/two-factor-authentication.module';
import { StatusModule } from './status/status.module';
// import { History } from './history/history.entity';
// import { Player } from './players/player.entity';

@Module({
	imports: [
		PlayersModule,
		TypeOrmModule.forRoot({
			type: 'postgres',
			host: 'postgres',
			port: 5432,
			username: 'postgres',
			password: 'postgres',
			database: 'backend_db',
			autoLoadEntities: true,
			synchronize: true,
			// entities: [ "src/**/**.entity{.ts,.js}" ],
		}),
		AvatarModule,
		GameModule,
		HistoryModule,
		TwoFactorAuthenticationModule,
		StatusModule,
	],
})
export class AppModule {}
