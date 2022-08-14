import { useState, useCallback } from "react";
import axios from "axios";

import { Player } from "../types/api/Player";
import { constUrl } from "../constant/constUrl";

//全てのプレイヤー情報を取得するhooks

export const useAllPlayers = () => {
	const [players, setPlayers] = useState<Array<Player>>([]);

	const getPlayers = useCallback(() => {
		axios
			.get<Array<Player>>(constUrl.serversideUrl + "/players")
			.then((res) => {
				setPlayers(
					res.data.sort(function (a, b) {
						if (a.displayName < b.displayName) return -1;
						if (b.displayName < a.displayName) return 1;
						return 0;
					})
				);
			})
			.catch(() => console.log("Not found players"));
	}, []);
	return { getPlayers, players };
};
