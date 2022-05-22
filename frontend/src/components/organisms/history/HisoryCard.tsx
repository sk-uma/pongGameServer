import { memo, VFC } from "react";
import { Text, Grid, GridItem, Box, Flex } from "@chakra-ui/react";
import { PlayerDisplay } from "./PlayerDisplay";

type Props = {
	leftPlayer: string;
	rightPlayer: string;
	leftScore: number;
	rightScore: number;
	winner: string;
	loser: string;
};

export const HistoryCard: VFC<Props> = memo((props) => {
	const { leftPlayer, rightPlayer, leftScore, rightScore, winner } = props;

	return (
		<Grid
			templateColumns="repeat(7, 1fr)"
			gap={{ base: 2, lg: 5 }}
			bgColor="gray.100"
			p={3}
			borderRadius="10px"
			w={{ base: "350px", lg: "750px" }}
		>
			<GridItem colSpan={1}>
				{winner === leftPlayer ? (
					<Box
						bg="pink.300"
						m={3}
						w={{ base: "50px", lg: "100px" }}
						borderRadius="10px"
					>
						<Text
							align="center"
							fontSize={{ base: "sm", lg: "3xl" }}
							color="white"
						>
							Win
						</Text>
					</Box>
				) : (
					<Box
						bg="blue.300"
						m={3}
						w={{ base: "50px", lg: "100px" }}
						borderRadius="10px"
					>
						<Text
							align="center"
							fontSize={{ base: "sm", lg: "3xl" }}
							color="white"
						>
							Lose
						</Text>
					</Box>
				)}
			</GridItem>
			<GridItem colSpan={1}>
				<Flex justify="center">
					<PlayerDisplay name={leftPlayer} />
				</Flex>
			</GridItem>
			<GridItem colSpan={1}>
				<Flex justify="center">
					<Box w={{ base: "30px", lg: "60px" }}>
						<Text
							textAlign="center"
							fontSize={{ base: "xl", lg: "5xl" }}
							fontWeight="bold"
						>{`${leftScore}`}</Text>
					</Box>
				</Flex>
			</GridItem>
			<GridItem colSpan={1}>
				<Flex justify="center">
					<Box w="2px">
						<Text
							align="center"
							fontSize={{ base: "xl", lg: "5xl" }}
							fontWeight="bold"
						>
							-
						</Text>
					</Box>
				</Flex>
			</GridItem>
			<GridItem colSpan={1}>
				<Flex justify="center">
					<Box w={{ base: "30px", lg: "60px" }}>
						<Text
							align="center"
							fontSize={{ base: "xl", lg: "5xl" }}
							fontWeight="bold"
						>{`${rightScore}`}</Text>
					</Box>
				</Flex>
			</GridItem>
			<GridItem colSpan={1}>
				<Flex justify="center">
					<PlayerDisplay name={rightPlayer} />
				</Flex>
			</GridItem>
			<GridItem colSpan={1}>
				{winner === rightPlayer ? (
					<Box
						bg="pink.300"
						m={3}
						w={{ base: "50px", lg: "100px" }}
						borderRadius="10px"
					>
						<Text
							align="center"
							fontSize={{ base: "sm", lg: "3xl" }}
							color="white"
						>
							Win
						</Text>
					</Box>
				) : (
					<Box
						bg="blue.300"
						m={3}
						w={{ base: "50px", lg: "100px" }}
						borderRadius="10px"
					>
						<Text
							align="center"
							fontSize={{ base: "sm", lg: "3xl" }}
							color="white"
						>
							Lose
						</Text>
					</Box>
				)}
			</GridItem>
		</Grid>
	);
});
