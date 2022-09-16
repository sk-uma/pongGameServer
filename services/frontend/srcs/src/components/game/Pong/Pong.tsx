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

// export function Pong(props: {mode: string, gameType: string, privateKey?: string}) {
//   useEffect(() => {
//     gameInfo.socket = io(constUrl.serversideUrl);

//     gameInfo.socket.on('connect', () => {
//       gameInfo.socket?.emit('hello', 'connected');
//     });

//     gameInfo.socket.on('disconnect', () => {
//       console.log('disconnected...');
//     });
//     return (() => {
//       for (let i = 0; i < 1000; i++) {
//         gameInfo.socket?.emit('hello', i);
//       }
//       // gameInfo.socket?.disconnect();
//     })
//   }, []);

//   return (
//   <></>
//   );
// }

export function Pong(props: {mode: string, gameType: string, privateKey?: string}) {
  let [isConnected, setIsConnected] = useState(false);

	const style: CSSProperties = {
    // width: "1000px",
    // height: "100vh",
    textAlign: "center"
  }

  const { loginPlayer } = useLoginPlayer();

  const navigate = useNavigate();

  useEffect(() => {
    let g: Phaser.Game;
    gameInfo.socket = io(constUrl.serversideUrl);

    gameInfo.socket.on('connect', () => {
      // console.log('connected....');
      // gameInfo.socket?.emit('hello');
    });

    gameInfo.socket.on('disconnect', () => {
      // console.log(gameInfo.socket);
      // console.log('disconnected...');
    });

    /**
     * 待機終了時の処理
     */
    gameInfo.socket?.on('opponentIsReadyToStart', (data: any) => {
      gameInfo.roomID = data.roomId;
      gameInfo.isServer = data.isServer;
      gameInfo.gameData = data.gameData;
      if (!g) {
        if (props.gameType === 'pong') {
          g = new Phaser.Game(config);
          if (loginPlayer) {
            axios.patch(constUrl.serversideUrl+`/players/statusplay/${loginPlayer?.name}`);
          }

          g.events.on('hidden', () => {
            g?.destroy(true);
            if (loginPlayer) {
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
            // console.log('before disconnect');
            // gameInfo.socket?.disconnect();
            navigate('/home/game');
          });
        } else {
          g = new Phaser.Game(DXconfig);
          console.log('new Game!!');
          if (loginPlayer) {
            axios.patch(constUrl.serversideUrl+`/players/statusplay/${loginPlayer?.name}`);
          }
          g.events.on('hidden', () => {
            g?.destroy(true);
            if (loginPlayer) {
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
            // console.log('before disconnect');
            // gameInfo.socket?.disconnect();
            navigate('/home/game');
          });
        }
      }
      setIsConnected(true);
    });

    gameInfo.socket?.emit('joinRoom', {
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
    gameInfo.socket?.on('gameResult', (data: any) => {
      g?.destroy(true);
      if (loginPlayer) {
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
      // console.log('before disconnect');
      // gameInfo.socket?.disconnect();

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

    // console.log('send hello');

    return () => {
      // console.log('id:', gameInfo.socket?.id, gameInfo.socket?.connected);
      // for (let i = 0; i < 100; i++) {
      //   gameInfo.socket?.emit('hello', i);
      // }
      // console.log('id:', gameInfo.socket?.id, gameInfo.socket?.connected);
      // console.log(gameInfo.socket);
      gameInfo.socket?.emit('leaveRoom', {
        mode: props.mode,
        privateKey: props.privateKey,
        gameType: props.gameType,
        gameData: gameInfo.gameData,
        user: {
          name: `${loginPlayer?.name}`
        }
      });
      // gameInfo.socket?.emit('hello');
      // console.log('id:', gameInfo.socket?.id, gameInfo.socket?.connected);
      // gameInfo.socket?.disconnect();
      if (loginPlayer) {
        axios.patch(constUrl.serversideUrl+`/players/statuslogin/${loginPlayer?.name}`);
      }
      g?.destroy(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
      <div
        id="phaser-example"
        style={style}
      > </div>
    );
  }
}
