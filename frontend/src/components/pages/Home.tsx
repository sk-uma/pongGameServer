import { useLoginPlayer } from "../../hooks/useLoginPlayer";
import { memo, VFC, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { PlayerDetail } from "../organisms/player/PlayerDetail";
import { use42User } from "../../hooks/use42User";
import { Center, Spinner } from "@chakra-ui/react";
import { useResetLoginPlayer } from "../../hooks/useResetLoginPlayer";

//Loginした後のホームページ

export const Home: VFC = memo(() => {
	//42Authorizationでログインした場合、codeクエリパラメータを使用して、
	//ユーザー情報を引き出す。code取得するための設定
	const [searchParams] = useSearchParams();
	const code = searchParams.get("code");

	const { loginPlayer } = useLoginPlayer();
	const { getFtUser } = use42User();

	//Reloadした場合など、loginPlayer情報が失われた時LoginPlayerを再設定
	const { resetLoginPlayer } = useResetLoginPlayer();

	//42Authorizationでログインした場合、以下でloginPlayerを設定。
	//通常ログインの場合、loginPlayerにはユーザー情報設定済み。また、codeは空になっている
	useEffect(() => {
		getFtUser(code);
		loginPlayer && localStorage.setItem("loginName", loginPlayer.name);
		!loginPlayer && localStorage.getItem("loginName") && resetLoginPlayer();
		//		eslint-disable-next-line react-hooks/exhaustive-deps
	}, [code]);

	if (loginPlayer) {
		return (
			<PlayerDetail
				imgUrl={loginPlayer.imgUrl}
				name={loginPlayer.name}
				displayName={loginPlayer.displayName}
				win={loginPlayer.win}
				lose={loginPlayer.lose}
				level={loginPlayer.level}
				exp={loginPlayer.exp}
				friends={loginPlayer.friends}
				blockList={loginPlayer.blockList}
			/>
		);
	} else {
		return (
			<Center h="100vh">
				<Spinner />
			</Center>
		);
	}
});
