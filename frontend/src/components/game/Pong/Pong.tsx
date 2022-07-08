import { Socket, io } from "socket.io-client";
import React, { useEffect, CSSProperties, useState } from 'react';
import { config } from "./PongConfig";
import { useLoginPlayer } from "../../../hooks/useLoginPlayer";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { constUrl } from "../../../constant/constUrl";

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
    },
    nextServe: 'host' | 'client';
    latestPaddlePosition: {
      host: number;
      client: number;
    }
  }
};

export let gameInfo: GameInfo = {
  gameData: {
    score: {
      hostPlayerScore: 0,
      clientPlayerScore: 0
    },
    nextServe: 'host',
    latestPaddlePosition: {
      host: -1,
      client: -1
    }
  }
};

export function Pong(props: {mode: string, gameType: string, privateKey?: string}) {
  // console.log('Pong component');
  // console.log(props);

  let [isConnected, setIsConnected] = useState(false);

	const style: CSSProperties = {
    textAlign: "center"
  }

  const { loginPlayer } = useLoginPlayer();

  // console.log(loginPlayer?.name);
  const navigate = useNavigate();

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
      gameInfo.roomID = data.roomId;
      gameInfo.isServer = data.isServer;
      gameInfo.gameData = data.gameData;
      console.log("ready to start", gameInfo.gameData.score.hostPlayerScore, gameInfo.gameData.score.clientPlayerScore);
      if (!g) {
        if (props.gameType === 'pong') {
          g = new Phaser.Game(config);
        } else {
          g = new Phaser.Game(config);
        }
      }
      setIsConnected(true);
    });

    gameInfo.socket.emit('joinRoom', {
      mode: props.mode,
      privateKey: props.privateKey,
      gameType: props.gameType,
      user: {
        name: `${loginPlayer?.name}`
      }
    });

    gameInfo.socket.on('gameResult', (data: any) => {
      // console.log('gameResult');
      g?.destroy(true);
      gameInfo.socket?.emit('leaveRoom', {
        mode: props.mode,
        privateKey: props.privateKey,
        gameType: props.gameType,
        user: {
          name: `${loginPlayer?.name}`
        }
      });
      gameInfo.socket?.disconnect();

      if (gameInfo.isServer) {
        axios.post(constUrl.serversideUrl + '/history', {
          leftPlayer: data.hostPlayer.name,
          leftScore: data.hostPlayer.score,
          rightPlayer: data.clientPlayer.name,
          rightScore: data.clientPlayer.score,
        });
      }

      navigate('/home/game/result', {state: data});
    });

    return () => {
      g?.destroy(true);
      gameInfo.socket?.emit('leaveRoom', {
        mode: props.mode,
        privateKey: props.privateKey,
        gameType: props.gameType,
        user: {
          name: `${loginPlayer?.name}`
        }
      });

      gameInfo.socket?.disconnect();
    }
  }, [navigate]);

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
