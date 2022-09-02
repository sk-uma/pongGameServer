import { Module } from '@nestjs/common';
import { PlayersService } from './players.service';
import { PlayersController } from './players.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayersRepository } from './players.repository';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { JwtAuthGuard } from './guards/jwt.auth.guards';

@Module({
	imports: [
		TypeOrmModule.forFeature([PlayersRepository]),
		PassportModule.register({ defaultStragegy: 'jwt' }),
		JwtModule.register({
			secret: 'secretKey',
			signOptions: {
				expiresIn: 3600,
			},
		}),
	],
	providers: [PlayersService, JwtStrategy, JwtAuthGuard],
	controllers: [PlayersController],
	exports: [PlayersService, JwtStrategy, JwtAuthGuard],
})
export class PlayersModule {}
