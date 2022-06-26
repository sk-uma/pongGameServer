import { memo, useState, VFC } from "react";
import { useLocation } from "react-router-dom";

interface gameMetaData {
  mode: string,
  game: string
  data?: any
}

export const GamePlay: VFC = memo(() => {
  const location = useLocation();
  const [data, setMode] = useState<gameMetaData>(location.state as gameMetaData);

  console.log(
    data
  )

  return (
    <>
      {`mode: ${data.mode}, game: ${data.game}, data: ${data.data}`}
    </>
  );
});