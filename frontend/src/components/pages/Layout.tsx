import { memo, VFC } from "react";
import { Outlet } from "react-router-dom";
import { HeaderLayout } from "../templates/HeaderLayout";

//Headerのレイアウト設定用。src/router/Router.tsx参照

export const Layout: VFC = memo(() => {
	return (
		<>
			<HeaderLayout />
			<Outlet />;
		</>
	);
});
