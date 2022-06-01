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

	//全対戦履歴の取得
	async findAll(): Promise<History[]> {
		return await this.historyRepository.find();
	}

	//特定プレイヤーの対戦履歴の取得
	async findByName(name: string): Promise<History[]> {
		const res1 = await this.historyRepository.find({ leftPlayer: name });
		const res2 = await this.historyRepository.find({ rightPlayer: name });
		return await res1.concat(res2);
	}

	//新規対戦履歴の作成
	//対戦履歴の作成と共にプレイヤーの勝ち負け、経験値、レベルの更新をする
	//経験値は、勝った場合、相手のレベルx100加算。負けた場合、相手のレベルx10加算とする
	//次のレベルアップまで必要な経験値は現レベルx100とする
	//累積の経験値からレベルを算出する
	async createHistory(createHistoryDto: CreateHistoryDto): Promise<History> {
		//レベル計算用関数
		const calLev = (exp, lv) => {
			const sumExp = (lv) => (100 * lv * (lv + 1)) / 2;
			while (exp / sumExp(lv) >= 1) {
				lv++;
			}
			return lv;
		};

		const leftplayer = await this.playersService.findByName(
			createHistoryDto.leftPlayer,
		);
		const rightplayer = await this.playersService.findByName(
			createHistoryDto.rightPlayer,
		);
		const winner =
			createHistoryDto.leftScore > createHistoryDto.rightScore
				? leftplayer
				: rightplayer;
		const loser =
			createHistoryDto.leftScore > createHistoryDto.rightScore
				? rightplayer
				: leftplayer;

		await this.playersService.updatePlayerWin(winner.name, winner.win + 1);
		await this.playersService.updatePlayerLose(loser.name, loser.lose + 1);
		await this.playersService.updatePlayerExp(
			winner.name,
			(winner.exp = winner.exp + loser.level * 100),
		);
		await this.playersService.updatePlayerExp(
			loser.name,
			(loser.exp = loser.exp + winner.level * 10),
		);
		await this.playersService.updatePlayerLevel(
			winner.name,
			calLev(winner.exp, winner.level),
		);
		await this.playersService.updatePlayerLevel(
			loser.name,
			calLev(loser.exp, loser.level),
		);

		return this.historyRepository.createHistory(createHistoryDto);
	}

	//特定プレイヤーの対戦履歴の削除
	async deleteHistoryByName(name: string): Promise<void> {
		await this.historyRepository.delete({ leftPlayer: name });
		await this.historyRepository.delete({ rightPlayer: name });
	}
}
