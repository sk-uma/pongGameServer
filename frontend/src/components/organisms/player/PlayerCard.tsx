import { memo, FC } from "react";
import { Box, Stack, Image, Text } from "@chakra-ui/react";

type Props = {
	imgUrl: string;
	name: string;
	win: number;
	lose: number;
	level: number;
	exp: number;
};

export const PlayerCard: FC<Props> = memo((props) => {
	const { imgUrl, name, win, lose, level, exp } = props;
	return (
		<Box
			w="260px"
			h="300px"
			bg="white"
			borderRadius="10px"
			shadow="md"
			p={4}
		>
			<Stack textAlign="center">
				<Image
					borderRadius="full"
					boxSize="160px"
					src={imgUrl}
					alt={name}
					m="auto"
				/>
				<Text fontSize="lg" fontWeight="bold">
					{name}
				</Text>
				<Text fontSize="mdg" fontWeight="bold">
					{`LEVEL: ${level}`}
				</Text>
				<Text fontSize="sm" color="gray">
					{`Win: ${win} Lose: ${lose} Exp: ${exp}`}
				</Text>
			</Stack>
		</Box>
	);
});
