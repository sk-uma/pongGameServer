import { Socket, io } from "socket.io-client";
import React, { useEffect, CSSProperties, useState, useRef } from 'react';
import { config, DXconfig } from "./PongConfig";
import { useLoginPlayer } from "../../../hooks/useLoginPlayer";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { constUrl } from "../../../constant/constUrl";
import { Box, Center, Spinner, Stack, Text, Link } from "@chakra-ui/react";
import { IonPhaser } from '@ion-phaser/react';

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
  const gameRef = useRef<any>(null);
  // const [gameInitialize, setGameInitialize] = useState(false);

  // config.parent = gameRef.current;

	const style: CSSProperties = {
    // width: "1000px",
    // height: "100vh",
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

    /**
     * 待機終了時の処理
     */
    gameInfo.socket.on('opponentIsReadyToStart', (data: any) => {
      gameInfo.roomID = data.roomId;
      gameInfo.isServer = data.isServer;
      gameInfo.gameData = data.gameData;
      console.log("ready to start", gameInfo.gameData.score.hostPlayerScore, gameInfo.gameData.score.clientPlayerScore);
      if (!g) {
        if (props.gameType === 'pong') {
          g = new Phaser.Game(config);
          g.events.on('hidden', () => {
            g?.destroy(true);
            gameInfo.socket?.emit('leaveRoom', {
              mode: props.mode,
              privateKey: props.privateKey,
              gameType: props.gameType,
              gameData: gameInfo.gameData,
              user: {
                name: `${loginPlayer?.name}`
              }
            });
            gameInfo.socket?.disconnect();
            navigate('/home/game');
          });
          // g.events.off('')
          // setGameInitialize(true);
        } else {
          g = new Phaser.Game(DXconfig);
          g.events.on('hidden', () => {
            g?.destroy(true);
            gameInfo.socket?.emit('leaveRoom', {
              mode: props.mode,
              privateKey: props.privateKey,
              gameType: props.gameType,
              gameData: gameInfo.gameData,
              user: {
                name: `${loginPlayer?.name}`
              }
            });
            gameInfo.socket?.disconnect();
            navigate('/home/game');
          });
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

    /**
     * ゲーム終了時の画面遷移
     */
    gameInfo.socket.on('gameResult', (data: any) => {
      g?.destroy(true);
      gameInfo.socket?.emit('leaveRoom', {
        mode: props.mode,
        privateKey: props.privateKey,
        gameType: props.gameType,
        gameData: gameInfo.gameData,
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
      // if (gameRef.current) {
      //   gameRef.current.destroy();
      // }
      // setGameInitialize(false);
      gameInfo.socket?.emit('leaveRoom', {
        mode: props.mode,
        privateKey: props.privateKey,
        gameType: props.gameType,
        gameData: gameInfo.gameData,
        user: {
          name: `${loginPlayer?.name}`
        }
      });

      gameInfo.socket?.disconnect();
    }
  }, [navigate]);

  // const Canvas = chakra('canvas');

  // console.log('init:', gameInitialize);

  if (!isConnected) {
    return (
      <Box height='300px'>
        <Center height='100%'>
          <Stack>
            <Center>
              <Spinner size='xl' color='blue.500' thickness='4px'/>
            </Center>
            <Text fontSize='3xl'>
              対戦相手を探しています...
            </Text>
          </Stack>
        </Center>
      </Box>
    )
  } else {
    return (
      // <Box width='100vw'>
      //   <Center>
      //     <IonPhaser ref={gameRef} game={config} initialize={gameInitialize}/>
      //   </Center>
      // </Box>

      <div
        id="phaser-example"
        // className="phaser-class"
        style={style}
      > </div>

      // <div style={style}>
      //   <a
      //     className="App-link"
      //     href="https://github.com/kevinshen56714/create-react-phaser3-app"
      //     target="_blank"
      //     rel="noopener noreferrer"
      //   > </a>
      // </div>

      // <Box width='100%'>
      //   <Center>
      //     Hello
      //     <div style={style}>
      //       <a
      //         className="App-link"
      //         href="https://github.com/kevinshen56714/create-react-phaser3-app"
      //         target="_blank"
      //         rel="noopener noreferrer"
      //       > </a>
      //     </div>
      //   </Center>
      // </Box>

      // <Box style={style}>
      //   <Center>
      //     <Link
      //       className="App-link"
      //       href="https://github.com/kevinshen56714/create-react-phaser3-app"
      //       target="_blank"
      //       rel="noopener noreferrer"
      //     />
      //   </Center>
      // </Box>
    );
  }
}
