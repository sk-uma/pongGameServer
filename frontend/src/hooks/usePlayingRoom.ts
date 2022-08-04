import axios from "axios";
import { useCallback, useState } from "react";
import { constUrl } from "../constant/constUrl";

export const usePlayingRoom = () => {
  const [playingRoom, setPlayingRoom] = useState<any>([]);

  const getPlayingRoom = useCallback(() => {
    axios
      .get<any>(constUrl.serversideUrl + `/game/playing-room`)
      .then((res) => setPlayingRoom(res.data))
      .catch()
  }, []);
  return { getPlayingRoom, playingRoom };
}
