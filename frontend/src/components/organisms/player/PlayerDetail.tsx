import { memo, FC, useCallback } from "react";
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
} from "@chakra-ui/react";
import { SettingsIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router";

type Props = {
	imgUrl: string;
	name: string;
	win: number;
	lose: number;
	level: number;
	exp: number;
};

export const PlayerDetail: FC<Props> = memo((props) => {
	const { imgUrl, name, win, lose, level, exp } = props;
	const navigate = useNavigate();
	const onClickEditProfile = useCallback(() => {
		navigate("/home/edit");
	}, [navigate]);

	return (
		<Center>
			<Box w="1500px" bg="white" p={20}>
				<Grid
					templateRows="repeat(2, 1fr)"
					templateColumns="repeat(5, 1fr)"
					gap={3}
				>
					<GridItem rowSpan={2} colSpan={1} bg="white">
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
							{name}
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
									value={20}
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
			</Box>
		</Center>
	);
});
