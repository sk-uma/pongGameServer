import { useState, useCallback } from "react";
import axios from "axios";

import { Player } from "../types/api/Player";

export const useAllPlayers = () => {
	const [players, setPlayers] = useState<Array<Player>>([]);

	const getPlayers = useCallback(() => {
		axios
			.get<Array<Player>>(`http://localhost:3001/players`)
			.then((res) => setPlayers(res.data))
			.catch(() => console.log("Not found players"));
	}, []);
	return { getPlayers, players };
};
