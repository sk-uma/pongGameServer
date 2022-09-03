import { Socket, io } from "socket.io-client";
import React, { useEffect, CSSProperties, useState } from 'react';
import { config, DXconfig } from "./PongConfig";
import { useLoginPlayer } from "../../../hooks/useLoginPlayer";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { constUrl } from "../../../constant/constUrl";
import { Box, Center, Spinner, Stack, Text } from "@chakra-ui/react";
// import { IonPhaser } from '@ion-phaser/react';

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
  // const gameRef = useRef<any>(null);

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
    gameInfo.socket = io(constUrl.serversideUrl);

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
      // console.log("ready to start", gameInfo.gameData.score.hostPlayerScore, gameInfo.gameData.score.clientPlayerScore);
      if (!g) {
        if (props.gameType === 'pong') {
          g = new Phaser.Game(config);
          if (loginPlayer) {
            // console.log('call patch');
            axios.patch(constUrl.serversideUrl+`/players/statusplay/${loginPlayer?.name}`);
          }

          g.events.on('hidden', () => {
            g?.destroy(true);
            if (loginPlayer) {
              // console.log('call patch');
              axios.patch(constUrl.serversideUrl+`/players/statuslogin/${loginPlayer?.name}`);
            }
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
          if (loginPlayer) {
            // console.log('call patch');
            axios.patch(constUrl.serversideUrl+`/players/statusplay/${loginPlayer?.name}`);
          }
          g.events.on('hidden', () => {
            g?.destroy(true);
            if (loginPlayer) {
              // console.log('call patch');
              axios.patch(constUrl.serversideUrl+`/players/statuslogin/${loginPlayer?.name}`);
            }
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
      if (loginPlayer) {
        // console.log('call patch');
        axios.patch(constUrl.serversideUrl+`/players/statuslogin/${loginPlayer?.name}`);
      }
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
      // console.log('is Active before destroy', g?.isRunning);
      g?.destroy(true);
      // console.log('is Active after destroy', g?.isRunning);

      if (loginPlayer) {
        // console.log('call patch');
        axios.patch(constUrl.serversideUrl+`/players/statuslogin/${loginPlayer?.name}`);
      }
      // if (gameRef.current) {
      //   gameRef.current.destroy();
      // }
      // setGameInitialize(false);
      // console.log('send leaveRoom in Pong.tsx');
      gameInfo.socket?.emit('leaveRoom', {
        mode: props.mode,
        privateKey: props.privateKey,
        gameType: props.gameType,
        gameData: gameInfo.gameData,
        user: {
          name: `${loginPlayer?.name}`
        }
      });
      console.log("socket", gameInfo.socket);
      // console.log(Boolean(gameInfo.socket));

      gameInfo.socket?.disconnect();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
