import { memo, FC, useState, useEffect, ChangeEvent } from "react";
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalBody,
	ModalHeader,
	ModalCloseButton,
	Stack,
	FormControl,
	FormLabel,
	Input,
	ModalFooter,
	Button,
} from "@chakra-ui/react";
import axios from "axios";
import { PrimaryButton } from "../../atoms/button/PrimaryButton";
import { useMessage } from "../../../hooks/useMessage";
import defaultImage from "./default_panda.jpg";
import { constUrl } from "../../../constant/constUrl";

type Props = {
	isOpen: boolean;
	onClose: () => void;
};

export const CreatePlayerModal: FC<Props> = memo((props) => {
	const { isOpen, onClose } = props;
	const { showMessage } = useMessage();
	const [username, setUserName] = useState("");
	const [password, setPassword] = useState("");

	useEffect(() => {}, []);

	const onChangeUserName = (e: ChangeEvent<HTMLInputElement>) =>
		setUserName(e.target.value);
	const onChangePassword = (e: ChangeEvent<HTMLInputElement>) =>
		setPassword(e.target.value);

	const onClickCancel = () => {
		setUserName("");
		setPassword("");
		onClose();
	};

	const onClickCreateMyAccount = () => {
		axios
			.post(constUrl.serversideUrl + "/players", {
				name: username,
				imgUrl: constUrl.serversideUrl + `/avatar/${username}`,
				password: password,
				ftUser: false,
			})
			.then(() => {
				const formData = new FormData();
				fetch(defaultImage)
					.then((res) => res.blob())
					.then((blob) => {
						formData.append("file", blob, "default_panda.jpg");
						axios.post(
							constUrl.serversideUrl + `/avatar/${username}`,
							formData,
							{
								headers: {
									"Content-Type": "multipart/form-data",
								},
							}
						);
					});
				showMessage({
					title: "Create Yout Account Successful",
					status: "success",
				});
				onClose();
			})
			.catch(() => {
				showMessage({
					title: `Sorry, User '${username}' is already exist. Change User name.`,
					status: "error",
				});
			});
	};

	return (
		<Modal
			isCentered
			isOpen={isOpen}
			onClose={onClose}
			autoFocus={false}
			motionPreset="slideInBottom"
		>
			<ModalOverlay>
				<ModalContent pb={4}>
					<ModalHeader>Welcome to 42_transcendence</ModalHeader>
					<ModalCloseButton />
					<ModalBody mx={4}>
						<Stack spacing={4}>
							<FormControl>
								<FormLabel>User name</FormLabel>
								<Input
									value={username}
									onChange={onChangeUserName}
								/>
							</FormControl>
							<FormControl>
								<FormLabel>Password</FormLabel>
								<Input
									value={password}
									onChange={onChangePassword}
								/>
							</FormControl>
						</Stack>
					</ModalBody>
					<ModalFooter>
						<Button mr={3} onClick={onClickCancel}>
							Cancel
						</Button>
						<PrimaryButton
							disabled={username === "" || password === ""}
							onClick={onClickCreateMyAccount}
						>
							Create My Account
						</PrimaryButton>
					</ModalFooter>
				</ModalContent>
			</ModalOverlay>
		</Modal>
	);
});
