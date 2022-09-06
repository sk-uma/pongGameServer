import axios from "axios";
import { useCallback, useState } from "react";
import { constUrl } from "../constant/constUrl";

export const useGameData = () => {
	const [gameData, setGameData] = useState<any>([]);

	const getGameData = useCallback((roomId: string, dataType: string) => {
		axios
			.get<any>(
				constUrl.serversideUrl + `/gameData/${roomId}/${dataType}`
			)
			.then((res) => setGameData(res.data))
			.catch(() => console.log("Not Found roomID or dataType"));
	}, []);
	return { getGameData, gameData };
};
