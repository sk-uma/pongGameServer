import { EntityRepository, Repository } from 'typeorm';
import { Player } from './player.entity';
import { CreatePlayerDto } from './dto/create.player.dto';
import * as bcrypt from 'bcrypt';

@EntityRepository(Player)
export class PlayersRepository extends Repository<Player> {
	//Player作成用のメソッド
	async createPlayer(createPlayerDto: CreatePlayerDto): Promise<Player> {
		const { name, password, ftUser, imgUrl } = createPlayerDto;
		//bcryptでパスワードを暗号化する。saltはhash化するときに付加する文字列
		const salt = await bcrypt.genSalt();
		const hashPassword = await bcrypt.hash(password, salt);

		const player = this.create({
			name,
			displayName: name,
			password: hashPassword,
			ftUser,
			imgUrl,
			win: 0,
			lose: 0,
			level: 1,
			exp: 0,
			friends: [],
			blockList: [],
		});
		await this.save(player);
		return player;
	}
}
