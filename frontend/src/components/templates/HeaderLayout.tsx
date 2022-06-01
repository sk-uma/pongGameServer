import { memo, VFC } from "react";

import { Header } from "../organisms/layout/Header";

//ヘッダーレイアウト用

export const HeaderLayout: VFC = memo(() => {
	return (
		<>
			<Header />
		</>
	);
});
