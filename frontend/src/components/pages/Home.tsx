import { memo, VFC } from "react";
import { Center, Spinner } from "@chakra-ui/react";

import { PlayerDetail } from "../organisms/player/PlayerDetail";
import { useLoginPlayer } from "../../hooks/useLoginPlayer";

//Loginした後のホームページ

export const Home: VFC = memo(() => {
	const { loginPlayer } = useLoginPlayer();

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
				friends={loginPlayer.friends.sort()}
				blockList={loginPlayer.blockList.sort()}
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
