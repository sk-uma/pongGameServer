import { useLoginPlayer } from "../../hooks/useLoginPlayer";
import { memo, VFC, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { PlayerDetail } from "../organisms/player/PlayerDetail";
import { use42User } from "../../hooks/use42User";
import { Center, Spinner } from "@chakra-ui/react";
import { useResetLoginPlayer } from "../../hooks/useResetLoginPlayer";

export const Home: VFC = memo(() => {
	const [searchParams] = useSearchParams();
	const code = searchParams.get("code");

	const { loginPlayer } = useLoginPlayer();
	const { getFtUser } = use42User();
	const { resetLoginPlayer } = useResetLoginPlayer();

	useEffect(() => {
		getFtUser(code);
		loginPlayer && localStorage.setItem("loginName", loginPlayer.name);
		!loginPlayer && localStorage.getItem("loginName") && resetLoginPlayer();
		//		eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	if (loginPlayer) {
		return (
			<PlayerDetail
				imgUrl={loginPlayer.imgUrl}
				name={loginPlayer.displayName}
				win={loginPlayer.win}
				lose={loginPlayer.lose}
				level={loginPlayer.level}
				exp={loginPlayer.exp}
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
