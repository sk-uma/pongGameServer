import { Avatar, Box, Button, Center, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Player } from "./Player";

export function RoomCard(props: {room_id: string, hostPlayer: string, clientPlayer: string}) {
  const navigate = useNavigate();

  const onClick = () => {
    navigate('/home/game/game-watch', {state: {
      room_id: props.room_id
    }});
  }

  return (
    <Center>
      <Box width='400px' height='350px' border='1px' borderColor='gray' borderRadius='lg'>
        <Stack direction='column'>
          <Box width='400px'  height='50px'>
            <Text align='center'>
              Pong or PongDX
            </Text>
          </Box>
          <Box width='400px' height='230px'>
            <Stack direction='row'>
              <Player
                playerName={props.hostPlayer}
              />
              <Player
                playerName={props.clientPlayer}
              />
            </Stack>
          </Box>
          <Box>
            <Center>
              <Button
                colorScheme='teal'
                onClick={onClick}
              >
                観戦
              </Button>
            </Center>
          </Box>
        </Stack>
      </Box>
    </Center>
  )
}