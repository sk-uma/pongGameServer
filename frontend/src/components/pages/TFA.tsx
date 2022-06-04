import { memo, VFC, useEffect, useState, ChangeEvent } from "react";
import {
	Box,
	Spinner,
	Center,
	Flex,
	Heading,
	Divider,
	Input,
	Button,
} from "@chakra-ui/react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { use42SetToken } from "../../hooks/use42SetToken";
import { useLoginPlayer } from "../../hooks/useLoginPlayer";
import { useNavigate } from "react-router";
import { constUrl } from "../../constant/constUrl";
import { useMessage } from "../../hooks/useMessage";

//通常ログイン、42ログイン共に一度こちらに遷移させる。
//42ログインの場合、setFtUserToken(code)によってAccessTokenの取得と
//プレイヤー情報の設定を実施する。通常ログインの場合はLoginページで
//既に設定されている。
//2要素認証が有効である場合はコード入力画面が表示される。
//無効である場合はHomeページへ遷移する。

export const TFA: VFC = memo(() => {
	const [searchParams] = useSearchParams();
	const code = searchParams.get("code");

	const navigate = useNavigate();
	const { setFtUserToken } = use42SetToken();
	const { loginPlayer } = useLoginPlayer();
	const [TFACode, setTFACode] = useState<string>("");
	const { showMessage } = useMessage();

	const onChangeTFACode = (e: ChangeEvent<HTMLInputElement>) =>
		setTFACode(e.target.value);

	const onClickVerify = () => {
		axios
			.post(
				constUrl.serversideUrl + "/2fa/authenticate",
				{ twoFactorAuthenticationCode: TFACode },
				{
					headers: {
						Authorization: `Bearer ${localStorage.getItem(
							"AccessToken"
						)}`,
					},
				}
			)
			.then(() => {
				navigate("/home");
			})
			.catch(() => {
				showMessage({
					title: "Code is Incorrect",
					status: "error",
				});
			});
	};
	const onClickBack = () => {
		navigate("/");
	};

	const moveHome = () => {
		window.location.href = constUrl.frontendUrl + "/home";
	};

	useEffect(() => {
		setFtUserToken(code);
		// eslint-disable-next-line
	}, []);

	if (loginPlayer && !loginPlayer.isTwoFactorAuthenticationEnabled) {
		moveHome();
		return <></>;
	} else if (loginPlayer) {
		return (
			<Flex align="center" justify="center" height="100vh">
				<Box bg="white" w="sm" p={4} borderRadius="md" shadow="md">
					<Heading as="h1" size="md" textAlign="center">
						Two Factor Authentication
					</Heading>
					<Divider my={4} />
					<Flex>
						<Input
							placeholder="Code"
							value={TFACode}
							onChange={onChangeTFACode}
						/>
						<Button mx={3} px={6} onClick={onClickBack}>
							Back
						</Button>
						<Button
							px={6}
							bg="teal.400"
							color="white"
							disabled={TFACode.length !== 6}
							_hover={{ opacity: 0.8 }}
							onClick={onClickVerify}
						>
							Verify
						</Button>
					</Flex>
				</Box>
			</Flex>
		);
	} else {
		return (
			<Center h="100vh">
				<Spinner />
			</Center>
		);
	}
});
