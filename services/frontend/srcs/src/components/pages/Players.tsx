import { memo, VFC, useEffect } from "react";
import { Wrap, WrapItem } from "@chakra-ui/react";

import { useAllPlayers } from "../../hooks/useAllPlayers";
import { PlayerCard } from "../organisms/player/PlayerCard";

//全プレイヤー閲覧ページ

export const Players: VFC = memo(() => {
	const { getPlayers, players } = useAllPlayers();

	useEffect(() => {
		getPlayers();
	}, [getPlayers]);

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
						status={player.status}
					/>
				</WrapItem>
			))}
		</Wrap>
	);
});
