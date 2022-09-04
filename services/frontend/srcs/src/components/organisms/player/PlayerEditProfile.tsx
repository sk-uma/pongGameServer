import {
	memo,
	VFC,
	useState,
	ChangeEvent,
	useRef,
	useEffect,
	useCallback,
} from "react";
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
	Button,
	useDisclosure,
} from "@chakra-ui/react";
import { RepeatIcon, WarningTwoIcon } from "@chakra-ui/icons";
import axios from "axios";

import { PrimaryButton } from "../../atoms/button/PrimaryButton";
import { useMessage } from "../../../hooks/useMessage";
import { DeletePlayerModal } from "./DeletePlayerModal";
import { useLoginPlayer } from "../../../hooks/useLoginPlayer";
import { constUrl } from "../../../constant/constUrl";
import { SetTFAModal } from "./setTFAModal";

//PlayerのEdit画面を表示するコンポーネント

type Props = {
	name: string;
	isTFA: boolean;
	ftUser: boolean;
	TFAQR: string;
};

export const PlayerEditProfile: VFC<Props> = memo((props) => {
	const { name, isTFA, ftUser, TFAQR } = props;
	const { showMessage } = useMessage();
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [playerName, setPlayerName] = useState<string>("");
	const [password, setPassword] = useState<string>("");
	const [avatarFile, setAvatarFile] = useState<File>();
	const { setLoginPlayer } = useLoginPlayer();
	const inputRef = useRef<HTMLInputElement>(null);

	const onChangePlayerName = (e: ChangeEvent<HTMLInputElement>) =>
		setPlayerName(e.target.value);

	const onChangePassword = (e: ChangeEvent<HTMLInputElement>) =>
		setPassword(e.target.value);

	const onChangeAvatarFile = (e: ChangeEvent<HTMLInputElement>) => {
		if (e.target.files) {
			setAvatarFile(e.target.files[0]);
		}
	};

	const onClickEditPlayerName = () => {
		axios
			.post(constUrl.serversideUrl + `/players/editname`, {
				name,
				displayName: playerName,
			})
			.then((res) => {
				setLoginPlayer(res.data);
				showMessage({
					title: "Edit Player Name Successful",
					status: "success",
				});
				setPlayerName("");
			})
			.catch((e) => {
				showMessage({
					title: e.response.data.message,
					status: "error",
				});
				setPlayerName("");
			});
	};

	const onClickEditPassword = () => {
		axios
			.post(constUrl.serversideUrl + `/players/editpass`, {
				name,
				password,
			})
			.then(() => {
				showMessage({
					title: "Edit Player Password Successful",
					status: "success",
				});
				setPassword("");
			})
			.catch((e) => {
				showMessage({
					title: e.response.data.message,
					status: "error",
				});
				setPassword("");
			});
	};

	const onClickChangeAvatar = () => {
		inputRef.current?.click();
	};

	const setAvatar = useCallback(() => {
		const formData = new FormData();
		if (avatarFile) {
			formData.append("file", avatarFile);
			axios
				.put(
					constUrl.serversideUrl + `/avatar/update/${name}`,
					formData,
					{
						headers: {
							"Content-Type": "multipart/form-data",
						},
					}
				)
				.then(() => {
					axios
						.get(`http://localhost:3001/players/${name}`)
						.then((res) => {
							axios
								.put(
									constUrl.serversideUrl +
										`/players/editimgurl/${name}`,
									{
										imgUrl:
											constUrl.serversideUrl +
											`/avatar/${name}`,
									}
								)
								.then(() => {
									window.location.reload();
								});
						});
					showMessage({
						title: "Change Avatar Image Successful",
						status: "success",
					});
				})
				.catch(() => {
					showMessage({
						title: `Sorry, Change Avatar Image Failed.`,
						status: "error",
					});
				});
		}
	}, [showMessage, avatarFile, name]);

	useEffect(() => {
		setAvatar();
	}, [setAvatar]);

	return (
		<Center>
			<Box w="800px" bg="white" p={20}>
				<Heading as="h1" size="lg" textAlign="center">
					{`Edit Profile for ${name} `}
				</Heading>
				<Stack pt={10} spacing={10}>
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
					{ftUser ? (
						<></>
					) : (
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
					)}
					<FormControl>
						<FormLabel>Avatar Image</FormLabel>
						<Flex justify="right">
							<Input
								type="file"
								ref={inputRef}
								hidden
								onChange={onChangeAvatarFile}
							/>
							<Button
								bg="teal.400"
								leftIcon={<RepeatIcon />}
								color="white"
								onClick={onClickChangeAvatar}
								_hover={{ opacity: 0.8 }}
							>
								Change Avatar Image
							</Button>
						</Flex>
					</FormControl>
					<FormControl>
						<FormLabel>Two Factor Authentication</FormLabel>
						<Flex justify="right">
							<SetTFAModal isTFA={isTFA} TFAQR={TFAQR} />
						</Flex>
					</FormControl>
					<FormControl pt={10}>
						<FormLabel>Delete Yout Account</FormLabel>
						<Flex justify="right">
							<Button
								ml={0}
								bg="red"
								leftIcon={<WarningTwoIcon />}
								color="white"
								onClick={onOpen}
								_hover={{ opacity: 0.8 }}
							>
								Delete
							</Button>
							<DeletePlayerModal
								name={name}
								isOpen={isOpen}
								onClose={onClose}
							/>
						</Flex>
					</FormControl>
				</Stack>
			</Box>
		</Center>
	);
});
