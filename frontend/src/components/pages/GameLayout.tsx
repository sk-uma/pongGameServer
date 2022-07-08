import { Alert, AlertDescription, AlertIcon, AlertTitle, Center } from "@chakra-ui/react";
import axios from "axios";
import { memo, useEffect, useState, VFC } from "react";
import { Outlet } from "react-router-dom";
import { constUrl } from "../../constant/constUrl";
import { useLoginPlayer } from "../../hooks/useLoginPlayer";
import { RoomAlert } from "../game/Layout/RoomAlert";

export const GameLayout: VFC = memo(() => {
  const [isLeaved, setIsLeaved] = useState(false);
  const { loginPlayer } = useLoginPlayer();

  useEffect(() => {
    axios
      .get(constUrl.serversideUrl + '/game/player-play-status', {params: {
        user: loginPlayer?.name
      }})
      .then((data) => {
        if (data.data.status !== 'notFound') {
          setIsLeaved(true);
        }
      })
  }, [isLeaved]);

  if (isLeaved) {
    return <RoomAlert/>
  } else {
    return <Outlet/>
  }
});
