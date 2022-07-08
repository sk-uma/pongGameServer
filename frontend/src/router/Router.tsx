import { memo, VFC } from "react";
import { Routes, Route } from "react-router";

import { Login } from "../components/pages/Login";
import { Page404 } from "../components/pages/Page404";
import { Layout } from "../components/pages/Layout";
import { Home } from "../components/pages/Home";
import { Chat } from "../components/pages/Chat";
import { Game } from "../components/pages/Game";
import { Players } from "../components/pages/Players";
import { LoginPlayerProvider } from "../providers/LoginPlayerProvider";
import { EditProfile } from "../components/pages/EditProfile";
import { History } from "../components/pages/History";
import { TFA } from "../components/pages/TFA";
import { PrivateGame } from "../components/pages/PrivateGame";
import { PublicGame } from "../components/pages/PublicGame";
import { GameWatchHome } from "../components/pages/GameWatchHome";
import { GamePlay } from "../components/pages/GamePlay";
import { GameResult } from "../components/pages/GameResult";
import { GameLayout } from "../components/pages/GameLayout";

//ページ遷移設定

export const Router: VFC = memo(() => {
	return (
		<LoginPlayerProvider>
			<Routes>
				<Route path="/" element={<Login />} />
				<Route path="/tfa" element={<TFA />} />
				<Route path="/home" element={<Layout />}>
					<Route index element={<Home />} />
					<Route path="chat" element={<Chat />} />
					<Route path="game" element={<GameLayout />}>
						<Route index element={<Game />} />
						<Route path="private" element={<PrivateGame />} />
						<Route path="public" element={<PublicGame />} />
						<Route path="watch" element={<GameWatchHome />} />
						<Route path="result" element={<GameResult />} />
					</Route>
					<Route path="game/play" element={<GamePlay />} />
					<Route path="players" element={<Players />} />
					<Route path="history" element={<History />} />
					<Route path="edit" element={<EditProfile />} />
				</Route>

				<Route path="*" element={<Page404 />} />
			</Routes>
		</LoginPlayerProvider>
	);
});
