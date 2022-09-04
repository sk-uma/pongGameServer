import { memo, VFC } from "react";
import { HistoryBoard } from "../organisms/history/HistoryBoard";

//全対戦履歴表示ページ(本番では除外するかもしれない)

export const History: VFC = memo(() => {
	return <HistoryBoard />;
});
