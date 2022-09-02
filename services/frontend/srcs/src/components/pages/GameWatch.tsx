import { memo, VFC } from "react";
import { useLocation } from "react-router-dom";
import { Watch } from "../game/Watch/Watch";

interface Data {
  room_id: string
}

export const GameWatch: VFC = memo(() => {
  const location = useLocation();
  const data = location.state as Data;
  // const [data, setData] = useState<Data>(location.state as Data);

  // console.log(data.room_id);

  return (
    <Watch
      room_id={data.room_id}
    />
  )
});
