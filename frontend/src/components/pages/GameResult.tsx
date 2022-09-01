import { Avatar, Center, Stack, Text } from "@chakra-ui/react";
import { memo, useEffect, VFC } from "react";
import { useLocation } from "react-router-dom";
import { usePlayer } from "../../hooks/usePlayer";
// import { PlayerCard } from "../organisms/player/PlayerCard";

interface GameResultType {
  gameType: string;
  hostPlayer: {
    name: string;
    score: number;
  };
  clientPlayer: {
    name: string;
    score: number;
  }
}

export const GameResult: VFC = memo(() => {
  const location = useLocation();
  // const [result, setResult] = useState<GameResultType>(location.state as GameResultType);
  // (location.state as GameResultType).hostPlayer.name;
  const result = location.state as GameResultType;
  const { getPlayer: getHostPlayer, player: hostPlayer } = usePlayer(result.hostPlayer.name);
  const { getPlayer: getClientPlayer, player: clientPlayer } = usePlayer(result.hostPlayer.name);
  // setResult(result);

  useEffect(() => {
    getHostPlayer();
    getClientPlayer();
  }, [getHostPlayer, getClientPlayer]);

  // console.log(result);

  // return (
  //   <Center>
  //     <PlayerCard
  //       imgUrl={hostPlayer?.imgUrl}
  //       name={hostPlayer?.name}
  //       displayName={hostPlayer?.displayName}
  //       win={hostPlayer?.win}
  //       lose={hostPlayer?.lose}
  //       level={hostPlayer?.level}
  //       exp={hostPlayer?.exp}
  //     />
  //   </Center>
  // );
  if (hostPlayer !== undefined) {
    return (
      <Center>
        <Stack>
          <Text fontSize='6xl'>
            Result
          </Text>
          <Stack direction='row' spacing='50px'>
            <Stack direction='column'>
              <Avatar size='2xl' src={hostPlayer?.imgUrl}></Avatar>
              <Text align='center'>
                {hostPlayer?.displayName}
              </Text>
              <Text fontWeight='bold' align='center'>
                {result.hostPlayer.score}
              </Text>
            </Stack>
            <Center h='120px'>
              <Text fontSize='6xl' fontWeight='bold' textAlign='center' align='center'>-</Text>
            </Center>
            <Stack direction='column'>
              <Avatar size='2xl' src={clientPlayer?.imgUrl}></Avatar>
              <Text align='center'>
                {clientPlayer?.displayName}
              </Text>
              <Text fontWeight='bold' align='center'>
                {result.clientPlayer.score}
              </Text>
            </Stack>
          </Stack>
        </Stack>
      </Center>
    );
  } else {
    return <></>
  }
});
