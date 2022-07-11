import { Avatar, Box, Button, Center, SimpleGrid, Stack, Text } from "@chakra-ui/react";
import { memo, VFC } from "react";
import { RoomCard } from "../game/Watch/RoomCard";

export const GameWatchHome: VFC = memo(() => {
  return (
    <Center>
      <SimpleGrid minChildWidth='400px' spacing='50px' width='80%'>
        <RoomCard/>
        {/* <Center>
          <Box width='400px' height='350px' border='1px' borderColor='gray' borderRadius='lg'>
            <Stack direction='column'>
              <Box width='400px'  height='50px'>
                <Text align='center'>
                  Pong or PongDX
                </Text>
              </Box>
              <Box width='400px' height='230px'>
                <Stack direction='row'>
                  <Center width='200px'>
                    <Stack>
                      <Avatar name='hogehoge' size='2xl' src='https://bit.ly/dan-abramov'></Avatar>
                      <Text align='center'>
                        Lv.42
                      </Text>
                      <Text align='center'>
                        Hoge Hoge
                      </Text>
                    </Stack>
                  </Center>
                  <Center width='200px'>
                    <Stack>
                      <Avatar name='hogehoge' size='2xl' src='https://bit.ly/dan-abramov'></Avatar>
                      <Text align='center'>
                        Lv.42
                      </Text>
                      <Text align='center'>
                        Hoge Hoge
                      </Text>
                    </Stack>
                  </Center>
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
        </Center> */}

        <Center>
          <Box width='400px' height='350px' bg='gray'></Box>
        </Center>

        <Center>
          <Box width='400px' height='350px' bg='gray'></Box>
        </Center>
        <Center>
          <Box width='400px' height='350px' bg='gray'></Box>
        </Center>
        <Center>
          <Box width='400px' height='350px' bg='gray'></Box>
        </Center>
        <Center>
          <Box width='400px' height='350px' bg='gray'></Box>
        </Center>
        <Center>
          <Box width='400px' height='350px' bg='gray'></Box>
        </Center>
        {/* {
          for () {
            ;
          }
        } */}
      </SimpleGrid>
    </Center>
  )
});
