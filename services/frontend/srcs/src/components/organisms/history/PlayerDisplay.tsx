import { memo, VFC, useState, useEffect } from "react";
import axios from "axios";
import { Box, Stack, Avatar, Text } from "@chakra-ui/react";
import { constUrl } from "../../../constant/constUrl";
import { Player } from "../../../types/api/Player";

type Props = {
	name: string;
};

//対戦履歴カードの中でアバター画像と表示名を表示するコンポーネント

export const PlayerDisplay: VFC<Props> = memo((props) => {
	const { name } = props;
	const [player, setPlayer] = useState<Player | null>(null);

	useEffect(() => {
		axios
			.get(constUrl.serversideUrl + `/players/${name}`)
			.then((res) => setPlayer(res.data));
	}, [name]);
	return (
		<Box w={{ base: "20px", lg: "80px" }}>
			<Stack spacing={1} textAlign="center">
				<Avatar
					src={player?.imgUrl}
					name={player?.displayName}
					boxSize={{ base: "20px", lg: "80px" }}
				></Avatar>
				<Text
					textAlign="center"
					fontSize={{ base: "xs", lg: "lg" }}
					fontWeight="bold"
				>
					{player?.displayName}
				</Text>
			</Stack>
		</Box>
	);
});
