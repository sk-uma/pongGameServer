import { Center, Divider, Stack, Text } from "@chakra-ui/react";
import { memo, VFC } from "react";
// import { useLocation } from "react-router-dom";
import { GeneratePrivateKey } from "../game/PrivateKey/GeneratePrivateKey";
import { JoinPrivateRoom } from "../game/PrivateKey/JoinPrivateRoom";

export const PrivateGame: VFC = memo(() => {

  return (
    <Center>
      <Stack width="80%" maxWidth="800px" minWidth="300px">
        <Text fontSize="6xl" width="100%">Custom Match</Text>
        <Divider />
        <Text fontSize="3xl" width="100%">キーの発行</Text>
        <GeneratePrivateKey />
        <Divider />
        <Text fontSize="3xl" width="100%">入室</Text>
        <JoinPrivateRoom/>
      </Stack>
    </Center>
  )
})
