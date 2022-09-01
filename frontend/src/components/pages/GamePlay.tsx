import { Box, Center } from "@chakra-ui/react";
import { memo, VFC } from "react";
import { useLocation } from "react-router-dom";
import { Pong } from "../game/Pong/Pong";

interface gameMetaData {
  mode: string,
  game: string
  data?: any
}

export const GamePlay: VFC = memo(() => {
  const location = useLocation();
  const data = location.state as gameMetaData;
  // const [data, setMode] = useState<gameMetaData>(location.state as gameMetaData);

  // console.log(
  //   data
  // )

  return (
    <Box>
      <Center>
        <Pong
          mode={data.mode}
          gameType={data.game}
          privateKey={data.data?.privateKey}
        />
      </Center>
    </Box>
  );
});