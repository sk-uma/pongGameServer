import { Injectable, ForbiddenException } from '@nestjs/common';
import { HistoryRepository } from './history.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateHistoryDto } from './dto/create.history.dto';
import { History } from './history.entity';
import { PlayersService } from '../players/players.service';

@Injectable()
export class HistoryService {
	constructor(
		@InjectRepository(HistoryRepository)
		private historyRepository: HistoryRepository,

		private playersService: PlayersService,
	) {}

	async findAll(): Promise<History[]> {
		return await this.historyRepository.find();
	}

	async findByName(name: string): Promise<History[]> {
		const res1 = await this.historyRepository.find({ leftPlayer: name });
		const res2 = await this.historyRepository.find({ rightPlayer: name });
		return await res1.concat(res2);
	}

	async createHistory(createHistoryDto: CreateHistoryDto): Promise<History> {
		const leftplayer = await this.playersService.findByName(
			createHistoryDto.leftPlayer,
		);
		const rightplayer = await this.playersService.findByName(
			createHistoryDto.rightPlayer,
		);
		return this.historyRepository.createHistory(createHistoryDto);
	}

	async deleteHistoryByName(name: string): Promise<void> {
		await this.historyRepository.delete({ leftPlayer: name });
		await this.historyRepository.delete({ rightPlayer: name });
	}
}
