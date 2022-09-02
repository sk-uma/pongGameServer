import { Alert, AlertDescription, AlertIcon, AlertTitle, Button, Center, useToast, VStack } from "@chakra-ui/react";
import axios from "axios";
// import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { constUrl } from "../../../constant/constUrl";
import { useLoginPlayer } from "../../../hooks/useLoginPlayer";


export function RoomAlert() {
  const navigate = useNavigate();
  const { loginPlayer } = useLoginPlayer();
  // const [isLeaved, setIsLeaved] = useState(true);
  const toast = useToast();

  const roomJoinClick = () => {
    axios
      .get(constUrl.serversideUrl + '/game/player-play-status', {params: {
        user: loginPlayer?.name
      }})
      .then((data) => {
        console.log(data.data.status);
        if (data.data.status === 'leaved') {
          navigate('/home/game/play', {state: {
            mode: 'public',
            game: 'pong',
          }});
        } else {
          toast({
            position: 'top',
            title: 'ルームが破棄されました',
            status: 'warning',
            // description: ''
          })
          // navigate('/home');
        }
      })
  }

	return (
		<Center>
      <VStack width='100%'>
        <Alert
          status='error'
          variant='subtle'
          flexDirection='column'
          alignItems='center'
          justifyContent='center'
          textAlign='center'
          height='200px'
          width='95%'
        >
          <AlertIcon boxSize='40px' mr={0} />
          <AlertTitle mt={4} mb={1} fontSize='lg'>
            離脱中のゲームがあります
          </AlertTitle>
          <AlertDescription maxWidth='sm'>
            現在離脱中です、復帰してください。
          </AlertDescription>
        </Alert>
        <Button colorScheme='teal' onClick={roomJoinClick}>
          復帰する
        </Button>
      </VStack>
		</Center>
	);
}