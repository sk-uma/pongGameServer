import {
	WebSocketGateway,
	WebSocketServer,
	SubscribeMessage,
	MessageBody,
	ConnectedSocket,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { PlayersService } from '../players/players.service';

type ChatRecieved = {
	uname: string;
	time: string;
	text: string;
};

type loginPlayer = {
	name: string;
};

@WebSocketGateway()
export class StatusGateway {
	constructor(private readonly playerService: PlayersService) {}

	@WebSocketServer()
	server: Server;

	private logger: Logger = new Logger('StatusGateway');

	afterInit(server: Server) {
		this.logger.log('Initialized!');
	}

	// 接続が切断された場合、データベースのステータスをログアウトに更新する
	async handleDisconnect(client: Socket) {
		this.logger.log(`Client disconnected: ${client.id}`);
		const player = await this.playerService.findByClientId(client.id);
		if (player) {
			await this.playerService.updateStatusLogout(player.name);
			await this.playerService.updateClientId(player.name, '');
		}
	}

	handleConnection(client: Socket, ...args: any[]) {
		this.logger.log(`Client connected: ${client.id}`);
	}
}
