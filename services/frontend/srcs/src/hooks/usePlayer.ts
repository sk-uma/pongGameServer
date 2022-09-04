import axios from "axios";
import { useCallback, useState } from "react"
import { constUrl } from "../constant/constUrl";
import { Player } from "../types/api/Player"

export const usePlayer = (playerName: string) => {
    const [player, setPlayer] = useState<Player>();

    const getPlayer = useCallback(() => {
        axios
            .get<Player>(constUrl.serversideUrl + `/players/${playerName}`)
            .then((res => setPlayer(res.data)))
            .catch(() => console.log('not found player'));
        // eslint-disable-next-line
    }, []);
    return {getPlayer, player};
}