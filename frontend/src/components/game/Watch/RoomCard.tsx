import { Avatar, Box, Button, Center, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import { Player } from "./Player";

export function RoomCard() {
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
                playerName="1"
              />
              <Player
                playerName="2"
              />
            </Stack>
          </Box>
          <Box>
            <Center>
              <Button colorScheme='teal'>
                観戦
              </Button>
            </Center>
          </Box>
        </Stack>
      </Box>
    </Center>
  )
}