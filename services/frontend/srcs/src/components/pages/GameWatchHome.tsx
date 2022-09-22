import { Center, SimpleGrid } from "@chakra-ui/react";
import { memo, useEffect, VFC } from "react";
import { usePlayingRoom } from "../../hooks/usePlayingRoom";
import { RoomCard } from "../game/Watch/RoomCard";

export const GameWatchHome: VFC = memo(() => {
  const { getPlayingRoom, playingRoom } = usePlayingRoom();
  
  useEffect(() => getPlayingRoom(), [getPlayingRoom]);

  // console.log(playingRoom);

  return (
    <Center>
      <SimpleGrid minChildWidth='400px' spacing='50px' width='80%'>
        {playingRoom.map((data: any) => (
          <div key={data.room_id}>
            <RoomCard
              room_id={data.roomId}
              hostPlayer={data.player.hostPlayer}
              clientPlayer={data.player.clientPlayer}
            />
          </div>
        ))}
      </SimpleGrid>
    </Center>
  )
});
