import { PlayersService } from './players.service';
import { CreatePlayerDto } from './dto/create.player.dto';
import { Player } from './player.entity';
import { CredentialDto } from './dto/credential.player.dto';
export declare class PlayersController {
    private playersService;
    constructor(playersService: PlayersService);
    findAll(): Promise<Player[]>;
    findByName(name: string): Promise<Player>;
    createPlayer(createPlayerDto: CreatePlayerDto): Promise<Player>;
    deletePlayer(name: string): Promise<void>;
    signIn(credentialDto: CredentialDto): Promise<Player>;
}
