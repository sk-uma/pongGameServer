import { memo, VFC, useState, ChangeEvent } from "react";
import {
	Center,
	Input,
	Stack,
	Box,
	FormControl,
	FormLabel,
	Heading,
	Grid,
	GridItem,
	Flex,
} from "@chakra-ui/react";
import { PrimaryButton } from "../../atoms/button/PrimaryButton";

type Props = {
	name: string;
};

export const PlayerEditProfile: VFC<Props> = memo((props) => {
	const { name } = props;
	const [playerName, setPlayerName] = useState<string>("");
	const [password, setPassword] = useState<string>("");

	const onChangePlayerName = (e: ChangeEvent<HTMLInputElement>) =>
		setPlayerName(e.target.value);
	const onChangePassword = (e: ChangeEvent<HTMLInputElement>) =>
		setPassword(e.target.value);

	const onClickEditPlayerName = () => {};
	const onClickEditPassword = () => {};
	return (
		<Center>
			<Box w="800px" bg="white" p={20}>
				<Heading as="h1" size="lg" textAlign="center">
					{`Edit Profile for ${name} `}
				</Heading>
				<Stack>
					<FormControl>
						<FormLabel>Player Name</FormLabel>
						<Flex justify="center">
							<Grid templateColumns="repeat(10, 1fr)" gap={3}>
								<GridItem colSpan={9}>
									<Input
										value={playerName}
										onChange={onChangePlayerName}
									/>
								</GridItem>
								<GridItem colSpan={1}>
									<PrimaryButton
										disabled={playerName === ""}
										onClick={onClickEditPlayerName}
									>
										Edit
									</PrimaryButton>
								</GridItem>
							</Grid>
						</Flex>
					</FormControl>
					<FormControl>
						<FormLabel>Password</FormLabel>
						<Flex justify="center">
							<Grid templateColumns="repeat(10, 1fr)" gap={3}>
								<GridItem colSpan={9}>
									<Input
										value={password}
										onChange={onChangePassword}
									/>
								</GridItem>
								<GridItem colSpan={1}>
									<PrimaryButton
										disabled={password === ""}
										onClick={onClickEditPassword}
									>
										Edit
									</PrimaryButton>
								</GridItem>
							</Grid>
						</Flex>
					</FormControl>
				</Stack>
			</Box>
		</Center>
	);
});
