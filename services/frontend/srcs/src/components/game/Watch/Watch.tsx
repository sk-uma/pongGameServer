import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Socket, io } from "socket.io-client";
import { config } from "./PongConfig";

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
  roomID: '',
  isServer: false,
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

function _socketOffGameEvent() {
  gameInfo.socket?.off('UpdateCheckedGameData');
  gameInfo.socket?.off('PlayerLeaveRoom');
  gameInfo.socket?.off('restartGame');
  gameInfo.socket?.off('updateEventGameData');
}


export function Watch(props: {room_id: string}) {
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

    gameInfo.socket.on('startWatchingData', (data: any) => {
      // console.log(data);
      gameInfo.gameData = data;
    });

    g = new Phaser.Game(config);
    gameInfo.socket.emit('startWatching', {
      roomId: props.room_id
    });

    gameInfo.socket.on('gameResult', (data: any) => {
      _socketOffGameEvent();
      g?.destroy(true);
      gameInfo.socket?.disconnect();

      navigate('/home/game/result', {state: data});
    });

    return () => {
      _socketOffGameEvent();
      g?.destroy(true);

      gameInfo.socket?.emit('finishWatching', {
        roomId: props.room_id
      });

      gameInfo.socket?.disconnect();
    }
  });

  return (
    <>
    </>
  );
}
