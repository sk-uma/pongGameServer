import { SubmitHandler, useForm } from "react-hook-form";
import { Box, Button, Center, FormControl, Input, Select, Stack } from "@chakra-ui/react";
import { useState } from "react";
import { GeneratePrivateKey } from "./PrivateKey/GeneratePrivateKey";
import { Pong } from "./Pong/Pong";


interface PrivateRoomForm {
  key: string
}

interface GameTypeForm {
  gameType: string
}

export function GameHome() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PrivateRoomForm>();

  const [privateKey, setPrivateKey] = useState("Hello");

  const onSubmit: SubmitHandler<PrivateRoomForm> = (data) => {
    console.log("data", data);
  }

  const onSubmitPrivateKey: SubmitHandler<PrivateRoomForm> = (data) => {
    console.log(data);
    setPrivateKey('world')
  }

  // return (
  //   <>
  //     <GeneratePrivateKey />
  //     <Pong />
  //   </>
  // )

  return (
    <Center>
      <Stack>
        <p>{ privateKey }</p>
        <Box minW='300px' w='60%'>
          <form onSubmit={handleSubmit(onSubmitPrivateKey)}>
            <FormControl>
              <Select {...register('key')}>
                <option value='pong'>Pong</option>
                <option value='pongDX'>Pong DX</option>
              </Select>
              {/* <Input 
                id="hello" 
                {
                  ...register('key', {
                    required: true
                  })
                }
              /> */}
            </FormControl>
            <Button mt={4} colorScheme='teal' isLoading={isSubmitting} type='submit'>
              キーを発行する
            </Button>
          </form>
        </Box>
        {/* <Box minW='300px' w='60%'>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormControl>
              <Input 
                id="privateKey" 
                {
                  ...register('key', {
                    required: true
                  })
                }
              />
            </FormControl>
            <Button mt={4} colorScheme='teal' isLoading={isSubmitting} type='submit'>
              部屋に入る
            </Button>
          </form>
        </Box> */}
      </Stack>
    </Center>
  );
  // return (
  //   <div>
  //     Hello
  //   </div>
  // )
}