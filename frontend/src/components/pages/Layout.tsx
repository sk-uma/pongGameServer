import { memo, VFC } from "react";
import { Outlet } from "react-router-dom";
import { HeaderLayout } from "../templates/HeaderLayout";

export const Layout: VFC = memo(() => {
	return (
		<>
			<HeaderLayout />
			<Outlet />;
		</>
	);
});
