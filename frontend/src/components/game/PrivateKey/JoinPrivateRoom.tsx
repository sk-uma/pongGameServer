import { Alert, AlertIcon, Button, Input, Stack } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { constUrl } from "../../../constant/constUrl";


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
  const [ isInvalidKey, setIsInvalidKey ] = useState(false);

  const onSubmit: SubmitHandler<JoinPrivateRoomForm> = (data) => {
    // console.log("data", data);
    axios
      .get(constUrl.serversideUrl + '/game/ckeckKey', {params: {
        key: data.privateKey
      }})
      .then(function(response) {
          navigate('/home/game/play', {state: {
            mode: 'private',
            game: 'pong',
            data: {
              privateKey: data.privateKey
            }
          }});
        }
      )
      .catch(
        function() {
          setIsInvalidKey(true);
        }
      )
  }

  if (isInvalidKey) {
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
                入室
              </Button>
            </Stack>
          </Stack>
        </form>
      </Stack>
    )
  } else {
    return (
      <Stack>
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
                入室
              </Button>
            </Stack>
          </Stack>
        </form>
      </Stack>
    )
  }
}