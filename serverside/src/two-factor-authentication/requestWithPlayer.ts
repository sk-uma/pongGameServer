import { Player } from '../players/player.entity';
import { Request } from 'express';

interface RequestWithPlayer extends Request {
	user: Player;
}

export default RequestWithPlayer;
