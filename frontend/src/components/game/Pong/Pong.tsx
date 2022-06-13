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
};

export let gameInfo: GameInfo = { };

export function Pong() {
  // console.log('Pong component');

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

    gameInfo.socket.emit('joinRoom', {
      user: {
        name: `${loginPlayer?.name}`
      }
    });

    // console.log("is connected", isConnected);

    gameInfo.socket.on('opponentIsReadyToStart', (data: any) => {
      // console.log("ready to start");
      gameInfo.roomID = data.roomId;
      gameInfo.isServer = data.isServer;
      if (!g) {
        g = new Phaser.Game(config);
      }
      setIsConnected(true);
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
