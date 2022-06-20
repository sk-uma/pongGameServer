import { memo, VFC, useEffect } from "react";
import { Outlet } from "react-router-dom";
import { HeaderLayout } from "../templates/HeaderLayout";
import { constUrl } from "../../constant/constUrl";
import { useGetPlayerwithToken } from "../../hooks/useGetPlayerWithToken";
import io from "socket.io-client";
import axios from "axios";
import { useLoginPlayer } from "../../hooks/useLoginPlayer";

//Headerのレイアウト設定用。src/router/Router.tsx参照
//ログイン後の共通した機能をまとめてここに記述したほうが扱いやすいことから
//ここに、websocket, Player情報取得を入れ込む

export const Layout: VFC = memo(() => {
	const { getPlayerWithToken } = useGetPlayerwithToken();
	const { loginPlayer } = useLoginPlayer();

	useEffect(() => {
		getPlayerWithToken();
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		//外で呼び出すとレンダリングの度に接続されるためuseEffectの中で呼び出し
		const socket = io(constUrl.serversideUrl);
		//loginPlayerが取得できている場合に限り、データベースのステータス情報を更新する
		loginPlayer
			? socket.on("connect", () => {
					axios.patch(
						constUrl.serversideUrl +
							`/players/statuslogin/${loginPlayer.name}`
					);
					axios.patch(
						constUrl.serversideUrl +
							`/players/updateId/${loginPlayer.name}/${socket.id}`
					);
			  })
			: socket.disconnect();
		//Layoutが適用されない、つまりLoginしていない状態のページに遷移するとsocket切断
		return () => {
			socket.disconnect();
		};
	}, [loginPlayer]);

	return (
		<>
			<HeaderLayout />
			<Outlet />;
		</>
	);
});
