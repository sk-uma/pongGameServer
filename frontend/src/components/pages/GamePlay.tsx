import { memo, useState, VFC } from "react";
import { useLocation } from "react-router-dom";
import { Pong } from "../game/Pong/Pong";

interface gameMetaData {
  mode: string,
  game: string
  data?: any
}

export const GamePlay: VFC = memo(() => {
  const location = useLocation();
  const [data, setMode] = useState<gameMetaData>(location.state as gameMetaData);

  // console.log(
  //   data
  // )

  return (
    <>
      <Pong
        mode={data.mode}
        gameType={data.game}
        privateKey={data.data?.privateKey}
      />
    </>
  );
});