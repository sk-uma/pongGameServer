import { memo, FC, useCallback, useEffect } from "react";
import {
	Box,
	Stack,
	Image,
	Text,
	Center,
	Grid,
	GridItem,
	Button,
	Flex,
	Progress,
	Wrap,
	WrapItem,
} from "@chakra-ui/react";
import { SettingsIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router";
import { useAllPlayers } from "../../../hooks/useAllPlayers";
import { FriendCard } from "./FriendCard";
import { HistoryCard } from "../history/HisoryCard";
import { useAllHistory } from "../../../hooks/useAllHistory";

//Profile画面を表示するためのコンポーネント

type Props = {
	imgUrl: string;
	name: string;
	displayName: string;
	win: number;
	lose: number;
	level: number;
	exp: number;
	friends: string[];
	blockList: string[];
};

export const PlayerDetail: FC<Props> = memo((props) => {
	const {
		imgUrl,
		name,
		displayName,
		win,
		lose,
		level,
		exp,
		friends,
		blockList,
	} = props;
	const { getPlayers, players } = useAllPlayers();
	const { getAllHistory, allHistory } = useAllHistory();

	const navigate = useNavigate();
	const onClickEditProfile = useCallback(() => {
		navigate("/home/edit");
	}, [navigate]);

	const progressVal = (ex: number, Lv: number) => {
		const dif = ex - ((Lv * (Lv - 1)) / 2) * 100;
		return (dif / (Lv * 100)) * 100;
	};

	useEffect(() => {
		getPlayers();
		getAllHistory();
	}, [getPlayers, getAllHistory]);

	return (
		<Center>
			<Box w="1500px" bg="white" pt={10} px={20} pb={20}>
				<Text fontSize={{ base: "md", lg: "5xl" }}>Profile</Text>
				<Grid
					templateRows="repeat(2, 1fr)"
					templateColumns="repeat(5, 1fr)"
					gap={3}
				>
					<GridItem display="flex" rowSpan={2} colSpan={1} bg="white">
						<Image
							borderRadius="full"
							src={imgUrl}
							alt={name}
							m="auto"
						/>
					</GridItem>
					<GridItem colSpan={2} bg="gray.50" borderRadius="10px">
						<Text p={1} fontSize={{ base: "md", lg: "xl" }}>
							Player Name
						</Text>
						<Text
							align="center"
							fontSize={{ base: "xl", lg: "5xl" }}
							fontWeight="bold"
						>
							{displayName}
						</Text>
					</GridItem>
					<GridItem colSpan={2} bg="gray.50" borderRadius="10px">
						<Text p={1} fontSize={{ base: "md", lg: "xl" }}>
							Record
						</Text>
						<Text
							align="center"
							fontSize={{ base: "xl", lg: "5xl" }}
							fontWeight="bold"
						>
							{`${win} win - ${lose} lose`}
						</Text>
					</GridItem>
					<GridItem colSpan={1} bg="gray.50" borderRadius="10px">
						<Text p={1} fontSize={{ base: "md", lg: "xl" }}>
							Level
						</Text>
						<Text
							align="center"
							fontSize={{ base: "xl", lg: "5xl" }}
							fontWeight="bold"
						>
							{`${level}`}
						</Text>
					</GridItem>
					<GridItem colSpan={3} bg="gray.50">
						<Stack
							flexDirection="column"
							justifyContent="space-between"
						>
							<Text fontSize={{ base: "md", lg: "xl" }}>
								For Next Level
							</Text>
							<Box px={2}>
								<Progress
									hasStripe
									colorScheme="green"
									height={{ base: "20px", lg: "40px" }}
									value={progressVal(exp, level)}
									borderRadius={5}
									bg="gray.200"
								/>
							</Box>
							<Text
								pr={3}
								align="right"
								fontSize={{ base: "sm", lg: "lg" }}
							>
								{`Exp:${exp}`}
							</Text>
						</Stack>
					</GridItem>
				</Grid>
				<Flex justify="right" pt={2}>
					<Button
						size="md"
						leftIcon={<SettingsIcon />}
						colorScheme="gray"
						variant="ghost"
						onClick={onClickEditProfile}
					>
						Edit Profile
					</Button>
				</Flex>
				<Box px={10} pt={10}>
					<Text fontSize={{ base: "sm", lg: "3xl" }}>Friends</Text>
					<Wrap
						p={{ base: 4, md: 10 }}
						align="left"
						bg="gray.50"
						borderRadius="10px"
						mx={10}
					>
						{friends.length ? (
							players
								?.filter((player) =>
									friends.includes(player.name)
								)
								.map((friend) => (
									<WrapItem key={friend.name} mx="auto">
										<FriendCard
											loginName={name}
											imgUrl={friend.imgUrl}
											name={friend.name}
											displayName={friend.displayName}
											level={friend.level}
											isfriend={true}
										/>
									</WrapItem>
								))
						) : (
							<Text
								fontSize={{ base: "sm", lg: "2xl" }}
								color="gray"
							>
								No Friends
							</Text>
						)}
					</Wrap>
				</Box>
				<Box px={10} pt={3}>
					<Text fontSize={{ base: "sm", lg: "3xl" }}>Block List</Text>
					<Wrap
						p={{ base: 4, md: 10 }}
						align="left"
						bg="gray.50"
						borderRadius="10px"
						mx={10}
					>
						{blockList.length ? (
							players
								?.filter((player) =>
									blockList.includes(player.name)
								)
								.map((friend) => (
									<WrapItem key={friend.name} mx="auto">
										<FriendCard
											loginName={name}
											imgUrl={friend.imgUrl}
											name={friend.name}
											displayName={friend.displayName}
											level={friend.level}
											isfriend={false}
										/>
									</WrapItem>
								))
						) : (
							<Text
								fontSize={{ base: "sm", lg: "2xl" }}
								color="gray"
							>
								Empty
							</Text>
						)}
					</Wrap>
				</Box>
				<Center>
					<Box
						w={{ base: "500px", lg: "1000px" }}
						bg="white"
						pt={{ base: 5, lg: 10 }}
						px={{ base: 10, lg: 20 }}
						pb={{ base: 10, lg: 20 }}
					>
						<Text fontSize={{ base: "sm", lg: "3xl" }}>
							History
						</Text>
						<Flex justify="center">
							<Wrap
								bgColor="gray.50"
								mx={{ base: 5, lg: 10 }}
								p={{ base: 4, lg: 8 }}
								w={{ base: "400px", lg: "800px" }}
								borderRadius="5px"
								justify="center"
							>
								{allHistory
									.filter(
										(res) =>
											name === res.leftPlayer ||
											name === res.rightPlayer
									)
									.map((history) => (
										<WrapItem key={history.id} py={2}>
											<HistoryCard
												leftPlayer={
													name === history.rightPlayer
														? history.rightPlayer
														: history.leftPlayer
												}
												rightPlayer={
													name === history.rightPlayer
														? history.leftPlayer
														: history.rightPlayer
												}
												leftScore={
													name === history.rightPlayer
														? history.rightScore
														: history.leftScore
												}
												rightScore={
													name === history.rightPlayer
														? history.leftScore
														: history.rightScore
												}
												winner={history.winner}
												loser={history.loser}
											/>
										</WrapItem>
									))}
							</Wrap>
						</Flex>
					</Box>
				</Center>
			</Box>
		</Center>
	);
});
