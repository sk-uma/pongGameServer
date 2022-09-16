import { Button, Center, Stack, Select } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { constUrl } from "../../../constant/constUrl";
import { useLoginPlayer } from "../../../hooks/useLoginPlayer";


interface GeneratePrivateKeyForm {
  gameType: string;
}

export function GeneratePrivateKey() {
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<GeneratePrivateKeyForm>();

  const [privateKey, setPrivateKey] = useState('');

  // const [isAlreadyGenerateKey, setIsAlreadyGenerateKey] = useState(false);

  const { loginPlayer } = useLoginPlayer();

  const onSubmit: SubmitHandler<GeneratePrivateKeyForm> = (data) => {
    axios
      .get(constUrl.serversideUrl + '/game/privateKeyGen', {params: {
        user: loginPlayer?.name,
        gameType: data.gameType
      }})
      .then(
        function(response) {
          setPrivateKey(response.data.privateKey);
        }
      )
    setPrivateKey('world')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack>
        <Select {...register('gameType')}>
          <option value='pong'>Pong</option>
          <option value='pongDx'>Pong DX</option>
        </Select>
        <Stack direction='row'>
          <Center
            width='70%'
            boxShadow='xs'
            rounded='md'
            textAlign='center'
            verticalAlign='middle'
            overflow='scroll'
          >
            { privateKey }
          </Center>
          <Button width='30%' mt={4} colorScheme='teal' isLoading={isSubmitting} type='submit'>
            キーを発行する
          </Button>
        </Stack>
      </Stack>
    </form>
  )
}
