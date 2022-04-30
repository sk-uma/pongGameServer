import { Repository } from 'typeorm';
import { Player } from './player.entity';
import { CreatePlayerDto } from './dto/create.player.dto';
export declare class PlayersRepository extends Repository<Player> {
    createPlayer(createPlayerDto: CreatePlayerDto): Promise<Player>;
}
