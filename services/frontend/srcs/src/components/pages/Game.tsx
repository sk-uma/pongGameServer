import { memo, VFC } from "react";
import { Button, Center, Stack, Text } from "@chakra-ui/react";
import { GiEarthAsiaOceania } from "react-icons/gi"
// import { RiChatPrivateLine } from "react-icons/ri"
import { AiFillEye } from "react-icons/ai"
import { useNavigate } from "react-router-dom";

export const Game: VFC = memo(() => {

	// useEffect(() => {
	// 	let socket = io("http://localhost:3001");
	// 	socket.on('connect', () => {
	// 		console.log('connected!!!!');
	// 	});
	// 	socket.on('disconnect', () => {
	// 		console.log('disconnect...');
	// 	});
	// 	return () => {
	// 		console.log("use Effect return");
	// 		socket.disconnect();
	// 	};
	// }, []);

  const navigate = useNavigate();

  // const onClickPrivateRoom = () => {
  //   navigate('/home/game/private', {state: {
  //     mode: 'private',
  //     data: {
  //       key: 'hogehoge'
  //     }
  //   }});
  // };
  const onClickPublicRoom = () => {
    navigate('/home/game/public');
  };
  const onClickWatching = () => {
    navigate('/home/game/watch')
  };

	return (
		// <Pong />
		// <GameHome />
		<Center>
      <Stack width="80%" maxWidth="800px" minWidth="300px">
        <Text fontSize="6xl" width="100%">Game</Text>
        <Button
          colorScheme='teal'
          size='lg'
          variant='outline'
          leftIcon={<GiEarthAsiaOceania />}
          onClick={onClickPublicRoom}
          width='100%'
        >
          公開マッチ
        </Button>
        {/* <Button
          colorScheme='teal'
          size='lg'
          variant='outline'
          leftIcon={<RiChatPrivateLine />}
          onClick={onClickPrivateRoom}
          width='100%'
        >
          カスタムマッチ
        </Button> */}
        <Button
          colorScheme='teal'
          size='lg'
          variant='outline'
          leftIcon={<AiFillEye />}
          onClick={onClickWatching}
          width='100%'
        >
          観戦
        </Button>
      </Stack>
		</Center>
	);
});
