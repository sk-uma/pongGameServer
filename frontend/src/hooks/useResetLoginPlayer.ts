import { constUrl } from "../constant/constUrl";
import { useCallback } from "react";
import axios from "axios";

import { useLoginPlayer } from "./useLoginPlayer";

export const useResetLoginPlayer = () => {
	const { setLoginPlayer } = useLoginPlayer();
	const name = localStorage.getItem("loginName");

	const resetLoginPlayer = useCallback(() => {
		axios.get(constUrl.serversideUrl + `/players/${name}`).then((res) => {
			setLoginPlayer(res.data);
		});
	}, [name, setLoginPlayer]);
	return {
		resetLoginPlayer,
	};
};
