import { useState, useCallback } from "react";
import axios from "axios";

import { constUrl } from "../constant/constUrl";
import { History } from "../types/api/History";
import { useGetPlayerwithToken } from "./useGetPlayerWithToken";

//全ての対戦履歴を取得するhooks

export const useAllHistory = () => {
	const [allHistory, setAllHistory] = useState<Array<History>>([]);
	const { getPlayerWithToken } = useGetPlayerwithToken();

	const getAllHistory = useCallback(() => {
		axios
			.get<Array<History>>(constUrl.serversideUrl + "/history")
			.then((res) => {
				setAllHistory(res.data);
				getPlayerWithToken();
			})
			.catch(() => console.log("Not found players"));
	}, [getPlayerWithToken]);
	return { getAllHistory, allHistory };
};
