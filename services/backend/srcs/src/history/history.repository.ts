import { EntityRepository, Repository } from 'typeorm';
import { History } from './history.entity';
import { CreateHistoryDto } from './dto/create.history.dto';

@EntityRepository(History)
export class HistoryRepository extends Repository<History> {
	async createHistory(createHstoryDto: CreateHistoryDto): Promise<History> {
		const { leftPlayer, rightPlayer, leftScore, rightScore } =
			createHstoryDto;
		const history = this.create({
			leftPlayer,
			rightPlayer,
			leftScore,
			rightScore,
			winner: leftScore > rightScore ? leftPlayer : rightPlayer,
			loser: leftScore > rightScore ? rightPlayer : leftPlayer,
		});
		await this.save(history);
		return history;
	}
}
