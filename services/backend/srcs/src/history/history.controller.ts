import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { HistoryService } from './history.service';
import { History } from './history.entity';
import { CreateHistoryDto } from './dto/create.history.dto';

@Controller('history')
export class HistoryController {
	constructor(private historyService: HistoryService) {}

	//全対戦履歴の取得
	@Get()
	async findAll(): Promise<History[]> {
		return this.historyService.findAll();
	}

	//特定プレイヤーの対戦履歴の取得
	@Get(':name')
	async findByName(@Param('name') name: string): Promise<History[]> {
		return await this.historyService.findByName(name);
	}

	//新規対戦履歴の作成
	@Post()
	createHistory(
		@Body() createHistoryDto: CreateHistoryDto,
	): Promise<History> {
		return this.historyService.createHistory(createHistoryDto);
	}

	//特定プレイヤーの対戦履歴の削除
	@Delete(':name')
	async deleteHistoryByName(@Param('name') name: string): Promise<void> {
		return this.historyService.deleteHistoryByName(name);
	}
}
