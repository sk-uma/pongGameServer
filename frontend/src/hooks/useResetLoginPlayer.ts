import { constUrl } from "../constant/constUrl";
import { useCallback } from "react";
import axios from "axios";

import { useLoginPlayer } from "./useLoginPlayer";

//登録済みのlocalStorageからログイン名を呼び出し、ログイン情報を再取得する

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
