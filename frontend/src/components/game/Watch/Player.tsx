import { Avatar, Center, Stack, Text } from "@chakra-ui/react";
import { useEffect } from "react";
import { usePlayer } from "../../../hooks/usePlayer";

export function Player(props: {playerName: string}) {
  const { getPlayer, player } = usePlayer(props.playerName);

  // console.log(getPlayer());

  useEffect(() => {
    getPlayer();
  }, [getPlayer]);

  return (
    <Center width='200px'>
      <Stack>
        <Avatar size='2xl' src={player?.imgUrl}></Avatar>
        <Text align='center'>
          Lv.{player?.level}
        </Text>
        <Text align='center'>
          {player?.displayName}
        </Text>
      </Stack>
    </Center>
  )
}