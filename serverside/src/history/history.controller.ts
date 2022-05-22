import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { HistoryService } from './history.service';
import { History } from './history.entity';
import { CreateHistoryDto } from './dto/create.history.dto';

@Controller('history')
export class HistoryController {
	constructor(private historyService: HistoryService) {}

	@Get()
	async findAll(): Promise<History[]> {
		return this.historyService.findAll();
	}

	@Get(':name')
	async findByName(@Param('name') name: string): Promise<History[]> {
		return await this.historyService.findByName(name);
	}

	@Post()
	createHistory(
		@Body() createHistoryDto: CreateHistoryDto,
	): Promise<History> {
		return this.historyService.createHistory(createHistoryDto);
	}

	@Delete(':name')
	async deleteHistoryByName(@Param('name') name: string): Promise<void> {
		return this.historyService.deleteHistoryByName(name);
	}
}
