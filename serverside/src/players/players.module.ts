import { Module } from '@nestjs/common';
import { PlayersService } from './players.service';
import { PlayersController } from './players.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PlayersRepository } from './players.repository';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

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
	providers: [PlayersService],
	controllers: [PlayersController],
	exports: [PlayersService],
})
export class PlayersModule {}
