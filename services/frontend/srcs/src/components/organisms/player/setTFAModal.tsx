import { memo, VFC, useState, ChangeEvent } from "react";
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalBody,
	ModalFooter,
	Button,
	useDisclosure,
	Input,
	Image,
	Text,
	Stack,
	Grid,
	GridItem,
} from "@chakra-ui/react";
import axios from "axios";
import { CheckIcon } from "@chakra-ui/icons";
import { constUrl } from "../../../constant/constUrl";
import { useMessage } from "../../../hooks/useMessage";

type Props = {
	isTFA: boolean;
	TFAQR: string;
};

export const SetTFAModal: VFC<Props> = memo((props) => {
	const { isTFA, TFAQR } = props;
	const { isOpen, onOpen, onClose } = useDisclosure();
	const [statusTFA, setStatusTFA] = useState<boolean>(isTFA);
	const [TFACode, setTFACode] = useState<string>("");
	const { showMessage } = useMessage();

	const onChangeTFACode = (e: ChangeEvent<HTMLInputElement>) =>
		setTFACode(e.target.value);

	const onClickTurnOffTFA = () => {
		axios
			.post(
				constUrl.serversideUrl + `/2fa/turnoff`,
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
				showMessage({
					title: "Two Factor Authentication is disable.",
					status: "success",
				});
				setTFACode("");
				onClose();
				setStatusTFA(false);
			})
			.catch(() => {
				showMessage({
					title: "Code is Incorrect or Access is Invalid",
					status: "error",
				});
				setTFACode("");
			});
	};

	const onClickTurnONTFA = () => {
		axios
			.post(
				constUrl.serversideUrl + `/2fa/turnon`,
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
				showMessage({
					title: "Two Factor Authentication is enable.",
					status: "success",
				});
				setTFACode("");
				onClose();
				setStatusTFA(true);
			})
			.catch(() => {
				showMessage({
					title: "Code is Incorrect or Access is Invalid",
					status: "error",
				});
				setTFACode("");
			});
	};

	return (
		<>
			{statusTFA ? (
				<Button
					bg="teal.400"
					color="white"
					leftIcon={<CheckIcon />}
					onClick={onOpen}
					_hover={{ opacity: 0.8 }}
				>
					{"ON => OFF"}
				</Button>
			) : (
				<Button
					bg="gray.400"
					color="white"
					onClick={onOpen}
					_hover={{ opacity: 0.8 }}
				>
					{"OFF => ON"}
				</Button>
			)}
			<Modal
				isCentered
				isOpen={isOpen}
				onClose={onClose}
				autoFocus={false}
				motionPreset="slideInBottom"
			>
				<ModalOverlay>
					<ModalContent pb={4}>
						<ModalHeader>
							{statusTFA
								? `Disable Two Factor Authentication`
								: `Enable Two Factor Authentication`}
						</ModalHeader>
						{statusTFA ? (
							<></>
						) : (
							<ModalBody>
								<Grid
									templateRows="repeat(1, 1fr)"
									templateColumns="repeat(10, 1fr)"
								>
									<GridItem rowSpan={1} colSpan={3}>
										<Image src={TFAQR} boxSize={"100px"} />
									</GridItem>
									<GridItem rowSpan={1} colSpan={7}>
										<Stack spacing={1}>
											<Text>
												{
													"1. Download an authentication app (Google/Microsoft Authenticator, etc.)."
												}
											</Text>
											<Text>
												{
													"2. Select add an account in the app."
												}
											</Text>
											<Text>
												{
													"3. With QR code, add an account."
												}
											</Text>
										</Stack>
									</GridItem>
								</Grid>
							</ModalBody>
						)}
						<ModalBody mx={4}>
							{`Enter the 6-digit code displayed on the two-factor authentication app.`}
						</ModalBody>
						<ModalFooter>
							<Input
								placeholder="Code"
								value={TFACode}
								onChange={onChangeTFACode}
							/>

							<Button mx={3} px={6} onClick={onClose}>
								Cancel
							</Button>
							<Button
								px={6}
								bg="teal.400"
								color="white"
								disabled={TFACode.length !== 6}
								_hover={{ opacity: 0.8 }}
								onClick={
									statusTFA
										? onClickTurnOffTFA
										: onClickTurnONTFA
								}
							>
								{statusTFA ? `OFF` : `ON`}
							</Button>
						</ModalFooter>
					</ModalContent>
				</ModalOverlay>
			</Modal>
		</>
	);
});
