import { memo, VFC, useCallback, useState, ChangeEvent } from "react";
import {
	Flex,
	Heading,
	Box,
	Divider,
	Stack,
	Input,
	Text,
	Link,
	useDisclosure,
} from "@chakra-ui/react";

import { PrimaryButton } from "../atoms/button/PrimaryButton";
import { useAuth } from "../../hooks/useAuth";
import { CreatePlayerModal } from "../organisms/player/CreatePlayerModal";

export const Login: VFC = memo(() => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { loading, login } = useAuth();

	const [userName, setUserName] = useState<string>("");
	const [userPassword, setPassword] = useState<string>("");

	const onChangeUserName = (e: ChangeEvent<HTMLInputElement>) =>
		setUserName(e.target.value);

	const onChangePassword = (e: ChangeEvent<HTMLInputElement>) =>
		setPassword(e.target.value);

	const onClickSignIn = () => login(userName, userPassword);

	const onClickFtAuth = useCallback(
		() =>
			(window.location.href =
				"https://api.intra.42.fr/oauth/authorize?client_id=5ec7a9808358afbd8a4a174c7d89d4ae27fc87b35477bf1065cc11387df68549&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fhome&response_type=code"),
		[]
	);

	return (
		<Flex align="center" justify="center" height="100vh">
			<Box bg="white" w="sm" p={4} borderRadius="md" shadow="md">
				<Heading as="h1" size="lg" textAlign="center">
					42_transcendence
				</Heading>
				<Divider my={4} />
				<Stack spacing={6} py={4} px={10}>
					<Input
						placeholder="User name"
						value={userName}
						onChange={onChangeUserName}
					/>
					<Input
						placeholder="Password"
						value={userPassword}
						onChange={onChangePassword}
					/>
					<PrimaryButton
						disabled={userName === "" || loading}
						loading={loading}
						onClick={onClickSignIn}
					>
						Sign In
					</PrimaryButton>
					<Text align="center">or</Text>
					<PrimaryButton onClick={onClickFtAuth}>
						42 Authorization
					</PrimaryButton>
				</Stack>
				<Divider my={4} />
				<Text align="center">
					Don't have an account?
					<Link color="teal.500" onClick={onOpen}>
						{" "}
						Sign Up
					</Link>
				</Text>
			</Box>
			<CreatePlayerModal isOpen={isOpen} onClose={onClose} />
		</Flex>
	);
});
