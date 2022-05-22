import { memo, VFC } from "react";
import { HistoryBoard } from "../organisms/history/HistoryBoard";

export const History: VFC = memo(() => {
	return <HistoryBoard />;
});
