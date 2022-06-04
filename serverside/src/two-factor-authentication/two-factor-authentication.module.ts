import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TwoFactorAuthenticationService } from './two-factor-authentication.service';
import { TwoFactorAuthenticationController } from './two-factor-authentication.controller';
import { PlayersModule } from '../players/players.module';

@Module({
	imports: [ConfigModule, PlayersModule],
	providers: [TwoFactorAuthenticationService],
	controllers: [TwoFactorAuthenticationController],
})
export class TwoFactorAuthenticationModule {}
