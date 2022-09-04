// import { Alert, AlertDescription, AlertIcon, AlertTitle, Center } from "@chakra-ui/react";
import axios from "axios";
import { memo, useEffect, useState, VFC } from "react";
import { Outlet } from "react-router-dom";
import { constUrl } from "../../constant/constUrl";
import { useLoginPlayer } from "../../hooks/useLoginPlayer";
import { RoomAlert } from "../game/Layout/RoomAlert";

export const GameLayout: VFC = memo(() => {
  const [isLeaved, setIsLeaved] = useState(false);
  const { loginPlayer } = useLoginPlayer();
  // const [idx, setIdx] = useState(0);

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
    // eslint-disable-next-line
  }, [isLeaved]);

  // useEffect(() => {
  //   setIdx(idx+1);
  //   console.log('idx');
  // }, [idx]);

  if (isLeaved) {
    return <RoomAlert/>
  } else {
    return (
      <>
        <Outlet/>
      </>
    )
  }
});
