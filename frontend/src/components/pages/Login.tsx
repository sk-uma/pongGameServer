import {
	memo,
	VFC,
	useCallback,
	useState,
	ChangeEvent,
	useEffect,
} from "react";
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
import { CreatePlayerModal } from "../organisms/player/CreatePlayerModal";
import { constUrl } from "../../constant/constUrl";
import { useSetToken } from "../../hooks/useSetToken";
import { useLoginPlayer } from "../../hooks/useLoginPlayer";

//ログインページ

export const Login: VFC = memo(() => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const { loading, setToken } = useSetToken();
	const { setLoginPlayer } = useLoginPlayer();

	const [userName, setUserName] = useState<string>("");
	const [userPassword, setPassword] = useState<string>("");

	const onChangeUserName = (e: ChangeEvent<HTMLInputElement>) =>
		setUserName(e.target.value);

	const onChangePassword = (e: ChangeEvent<HTMLInputElement>) =>
		setPassword(e.target.value);

	//通常ログイン用
	const onClickSignIn = () => setToken(userName, userPassword);

	//42Authorization用。事前に設定してあるAPIに遷移する
	const onClickFtAuth = useCallback(
		() => (window.location.href = constUrl.ftApiAuthUrl),
		[]
	);

	useEffect(() => {
		localStorage.setItem("AccessToken", "");
		setLoginPlayer(null);
	}, [setLoginPlayer]);

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
