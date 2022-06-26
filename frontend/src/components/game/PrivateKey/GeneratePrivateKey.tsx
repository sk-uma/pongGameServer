import { Box, Button, Center, Stack, Select, Text } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";


interface GeneratePrivateKeyForm {
  gameType: string;
}

export function GeneratePrivateKey() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<GeneratePrivateKeyForm>();

  const [privateKey, setPrivateKey] = useState('');

  const [isAlreadyGenerateKey, setIsAlreadyGenerateKey] = useState(false);

  const onSubmit: SubmitHandler<GeneratePrivateKeyForm> = (data) => {
    console.log("data", data);
    // axios.get('').then();
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
