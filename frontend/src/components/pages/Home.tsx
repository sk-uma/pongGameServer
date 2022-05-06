import { useLoginPlayer } from "../../hooks/useLoginPlayer";
import { memo, VFC, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

import { PlayerDetail } from "../organisms/player/PlayerDetail";
import { use42User } from "../../hooks/use42User";
import { Center, Spinner } from "@chakra-ui/react";

export const Home: VFC = memo(() => {
	const [searchParams] = useSearchParams();
	const code = searchParams.get("code");

	const { loginPlayer } = useLoginPlayer();
	const { getFtUser } = use42User();

	useEffect(() => {
		getFtUser(code);
	}, [getFtUser, code]);

	if (loginPlayer) {
		return (
			<PlayerDetail
				imgUrl={loginPlayer.imgUrl}
				name={loginPlayer.name}
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
