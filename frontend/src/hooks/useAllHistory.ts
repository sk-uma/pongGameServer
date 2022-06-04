import { useState, useCallback } from "react";
import axios from "axios";

import { constUrl } from "../constant/constUrl";
import { History } from "../types/api/History";

//全ての対戦履歴を取得するhooks

export const useAllHistory = () => {
	const [allHistory, setAllHistory] = useState<Array<History>>([]);

	const getAllHistory = useCallback(() => {
		axios
			.get<Array<History>>(constUrl.serversideUrl + "/history")
			.then((res) => setAllHistory(res.data))
			.catch(() => console.log("Not found players"));
	}, []);
	return { getAllHistory, allHistory };
};
