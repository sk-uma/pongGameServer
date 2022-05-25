import { useState, useCallback } from "react";
import axios from "axios";

import { Player } from "../types/api/Player";
import { constUrl } from "../constant/constUrl";

export const useAllPlayers = () => {
	const [players, setPlayers] = useState<Array<Player>>([]);

	const getPlayers = useCallback(() => {
		axios
			.get<Array<Player>>(constUrl.serversideUrl + "/players")
			.then((res) => setPlayers(res.data))
			.catch(() => console.log("Not found players"));
	}, []);
	return { getPlayers, players };
};
