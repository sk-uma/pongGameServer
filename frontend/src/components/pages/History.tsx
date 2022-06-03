import { memo, VFC, useEffect } from "react";
import { HistoryBoard } from "../organisms/history/HistoryBoard";
import { useGetPlayerwithToken } from "../../hooks/useGetPlayerWithToken";

//全対戦履歴表示ページ(本番では除外するかもしれない)

export const History: VFC = memo(() => {
	const { getPlayerWithToken } = useGetPlayerwithToken();

	useEffect(() => {
		getPlayerWithToken();
	}, [getPlayerWithToken]);

	return <HistoryBoard />;
});
