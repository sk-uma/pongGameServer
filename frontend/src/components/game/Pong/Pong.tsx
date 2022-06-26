import { Socket, io } from "socket.io-client";
import React, { useEffect, CSSProperties, useState } from 'react';
import { config } from "./PongConfig";
import { useLoginPlayer } from "../../../hooks/useLoginPlayer";

// export let socket: Socket;
// export let isServer: boolean = false;
interface GameInfo {
  socket?: Socket;
  roomID?: String;
  isServer?: boolean;
  gameData: {
    score: {
      hostPlayerScore: number;
      clientPlayerScore: number;
    }
  }
};

export let gameInfo: GameInfo = {
  gameData: {
    score: {
      hostPlayerScore: 0,
      clientPlayerScore: 0
    }
  }
};

export function Pong(props: {mode: string, game: string, privateKey?: string}) {
  // console.log('Pong component');
  console.log(props);

  let [isConnected, setIsConnected] = useState(false);

	const style: CSSProperties = {
    textAlign: "center"
  }

  const { loginPlayer } = useLoginPlayer();

  // console.log(loginPlayer?.name);

  useEffect(() => {
    let g: Phaser.Game;
    gameInfo.socket = io("http://localhost:3001");

    gameInfo.socket.on('connect', () => {
      // console.log('connected....');
    });

    gameInfo.socket.on('disconnect', () => {
      // console.log('disconnected...');
    });

    // console.log("is connected", isConnected);

    gameInfo.socket.on('opponentIsReadyToStart', (data: any) => {
      console.log("ready to start");
      gameInfo.roomID = data.roomId;
      gameInfo.isServer = data.isServer;
      gameInfo.gameData = data.gameData;
      if (!g) {
        g = new Phaser.Game(config);
      }
      setIsConnected(true);
    });

    gameInfo.socket.emit('joinRoom', {
      mode: props.mode,
      privateKey: props.privateKey,
      user: {
        name: `${loginPlayer?.name}`
      }
    });

    return () => {
      g?.destroy(true);
      gameInfo.socket?.emit('leaveRoom', {
        user: {
          name: `${loginPlayer?.name}`
        }
      });

      gameInfo.socket?.disconnect();
    }
  }, []);

  if (!isConnected) {
    return (
      <div>
        Standby...
      </div>
    )
  } else {
    return (
      <div style={style}>
          <a
            className="App-link"
            href="https://github.com/kevinshen56714/create-react-phaser3-app"
            target="_blank"
            rel="noopener noreferrer"
          > </a>
      </div>
    );
  }
}
