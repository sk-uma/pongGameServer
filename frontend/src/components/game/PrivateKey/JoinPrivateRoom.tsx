import { Alert, AlertIcon, Button, Input, Stack } from "@chakra-ui/react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";


interface JoinPrivateRoomForm {
  privateKey: string;
}


export function JoinPrivateRoom() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<JoinPrivateRoomForm>();

  const navigate = useNavigate();

  const onSubmit: SubmitHandler<JoinPrivateRoomForm> = (data) => {
    console.log("data", data);
    navigate('/home/game/play', {state: {
      mode: 'private',
      game: 'pong',
      data: {
        privateKey: data.privateKey
      }
    }});
  }

  return (
    <Stack>
      <Alert status='error'>
        <AlertIcon/>
        無効なキーです
      </Alert>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack>
          <Stack direction='row'>
            <Input
              width='70%'
              boxShadow='xs'
              rounded='md'
              textAlign='center'
              verticalAlign='middle'
              overflow='scroll'
              {...register('privateKey')}
            />
            <Button width='30%' mt={4} colorScheme='teal' isLoading={isSubmitting} type='submit'>
              キーを発行する
            </Button>
          </Stack>
        </Stack>
      </form>
    </Stack>
  )
}