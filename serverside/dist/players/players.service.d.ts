import { CreatePlayerDto } from './dto/create.player.dto';
import { PlayersRepository } from './players.repository';
import { Player } from './player.entity';
import { CredentialDto } from './dto/credential.player.dto';
export declare class PlayersService {
    private playersRepository;
    constructor(playersRepository: PlayersRepository);
    findAll(): Promise<Player[]>;
    findByName(name: string): Promise<Player>;
    createPlayer(createPlayerDto: CreatePlayerDto): Promise<Player>;
    deletePlayer(name: string): Promise<void>;
    signIn(credentialDto: CredentialDto): Promise<Player>;
}
