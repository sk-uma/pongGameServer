import { memo, VFC, useEffect } from "react";
import { Box, Text, Wrap, WrapItem, Center, Flex } from "@chakra-ui/react";
import { useAllHistory } from "../../../hooks/useAllHistory";
import { HistoryCard } from "./HisoryCard";

export const HistoryBoard: VFC = memo(() => {
	const { getAllHistory, allHistory } = useAllHistory();

	useEffect(() => getAllHistory(), [getAllHistory]);

	return (
		<Center>
			<Box
				w={{ base: "500px", lg: "1000px" }}
				bg="white"
				pt={{ base: 5, lg: 10 }}
				px={{ base: 10, lg: 20 }}
				pb={{ base: 10, lg: 20 }}
			>
				<Text fontSize={{ base: "xl", lg: "5xl" }}>History</Text>
				<Flex justify="center">
					<Wrap
						bgColor="gray.50"
						mx={{ base: 5, lg: 10 }}
						p={{ base: 4, lg: 8 }}
						w={{ base: "400px", lg: "800px" }}
						borderRadius="5px"
						justify="center"
					>
						{allHistory.map((history) => (
							<WrapItem py={2}>
								<HistoryCard
									leftPlayer={history.leftPlayer}
									rightPlayer={history.rightPlayer}
									leftScore={history.leftScore}
									rightScore={history.rightScore}
									winner={history.winner}
									loser={history.loser}
								/>
							</WrapItem>
						))}
					</Wrap>
				</Flex>
			</Box>
		</Center>
	);
});
