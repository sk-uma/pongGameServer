import { memo, VFC, useEffect } from "react";
import { Wrap, WrapItem } from "@chakra-ui/react";

import { useAllPlayers } from "../../hooks/useAllPlayers";
import { PlayerCard } from "../organisms/player/PlayerCard";
import { useLoginPlayer } from "../../hooks/useLoginPlayer";
import { useResetLoginPlayer } from "../../hooks/useResetLoginPlayer";

export const Players: VFC = memo(() => {
	const { getPlayers, players } = useAllPlayers();
	const { loginPlayer } = useLoginPlayer();
	const { resetLoginPlayer } = useResetLoginPlayer();

	useEffect(() => {
		getPlayers();
		loginPlayer && localStorage.setItem("loginName", loginPlayer.name);
		!loginPlayer && localStorage.getItem("loginName") && resetLoginPlayer();
		//		eslint-disable-next-line react-hooks/exhaustive-deps
	}, [resetLoginPlayer]);

	return (
		<Wrap p={{ base: 4, md: 10 }} justify="center" align="center">
			{players?.map((player) => (
				<WrapItem key={player.name} mx="auto">
					<PlayerCard
						imgUrl={player.imgUrl}
						name={player.name}
						displayName={player.displayName}
						win={player.win}
						lose={player.lose}
						level={player.level}
						exp={player.exp}
					/>
				</WrapItem>
			))}
		</Wrap>
	);
});
