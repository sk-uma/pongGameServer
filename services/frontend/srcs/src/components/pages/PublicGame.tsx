import { Button, Center, Stack, Text } from "@chakra-ui/react";
import { memo, VFC } from "react";
import { GiHypersonicMelon, GiPingPongBat } from "react-icons/gi";
import { useNavigate } from "react-router-dom";

export const PublicGame: VFC = memo(() => {

  const navigate = useNavigate();

  const onClickGame = (game: string) => {
    navigate('/home/game/play', {state: {
      mode: 'public',
      game: game,
    }});
  }

  return (
		<Center>
      <Stack width="80%" maxWidth="800px" minWidth="300px">
        <Text fontSize="6xl" width="100%">Game</Text>
        <Button
          colorScheme='teal'
          size='lg'
          variant='outline'
          leftIcon={<GiPingPongBat/>}
          onClick={() => onClickGame('pong')}
          width='100%'
        >
          Pong
        </Button>
        <Button
          colorScheme='teal'
          size='lg'
          variant='outline'
          leftIcon={<GiHypersonicMelon/>}
          onClick={() => onClickGame('pongDX')}
          width='100%'
        >
          Pong DX
        </Button>
      </Stack>
		</Center>
  )
});
