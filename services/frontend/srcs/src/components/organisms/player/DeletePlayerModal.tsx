import { memo, FC, useEffect } from "react";
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalBody,
	ModalHeader,
	ModalFooter,
	Button,
} from "@chakra-ui/react";
import axios from "axios";
import { useMessage } from "../../../hooks/useMessage";
import { useNavigate } from "react-router";
import { constUrl } from "../../../constant/constUrl";
import { useAllPlayers } from "../../../hooks/useAllPlayers";

//プレイヤー情報を削除するときに確認Modal画面を表示するコンポーネント

type Props = {
	name: string;
	isOpen: boolean;
	onClose: () => void;
};

export const DeletePlayerModal: FC<Props> = memo((props) => {
	const navigate = useNavigate();
	const { name, isOpen, onClose } = props;
	const { showMessage } = useMessage();
	const { getPlayers, players } = useAllPlayers();

	useEffect(() => getPlayers(), [getPlayers]);

	const onClickCancel = () => {
		onClose();
	};

	async function deleteFriendBlock(): Promise<void> {
		await players.forEach((player) => {
			console.log(player.name);
			if (player.friends.includes(name)) {
				axios.delete(
					constUrl.serversideUrl +
						`/players/deletefriend/${player.name}/${name}`
				);
			}
			if (player.blockList.includes(name)) {
				axios.delete(
					constUrl.serversideUrl +
						`/players/unblock/${player.name}/${name}`
				);
			}
		});
	}

	const onClickDeleteAccount = () => {
		axios.delete(constUrl.serversideUrl + `/history/${name}`).then(() => {
			deleteFriendBlock().then(() => {
				axios
					.delete(constUrl.serversideUrl + `/players/${name}`)
					.then(() => {
						console.log("2");
						axios.delete(
							constUrl.serversideUrl + `/avatar/${name}`
						);
						navigate("/");
						showMessage({
							title: "Delete Your Account Successful and Logout",
							status: "success",
						});
					})
					.catch(() => {
						showMessage({
							title: `Sorry, Delete Your Acount Failed.`,
							status: "error",
						});
					});
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
					<ModalHeader>Delete Your Account</ModalHeader>
					<ModalBody mx={4}>
						Are you sure? You can't undo this action afterwards.
					</ModalBody>
					<ModalFooter>
						<Button mr={3} onClick={onClickCancel}>
							Cancel
						</Button>
						<Button
							ml={0}
							bg="red"
							color="white"
							onClick={onClickDeleteAccount}
							_hover={{ opacity: 0.8 }}
						>
							Delete
						</Button>
					</ModalFooter>
				</ModalContent>
			</ModalOverlay>
		</Modal>
	);
});
