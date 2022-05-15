import { memo, FC, useState, useEffect, ChangeEvent } from "react";
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalBody,
	ModalHeader,
	ModalCloseButton,
	ModalFooter,
	Button,
} from "@chakra-ui/react";
import axios from "axios";
import { useMessage } from "../../../hooks/useMessage";
import { useNavigate } from "react-router";

type Props = {
	name: string;
	isOpen: boolean;
	onClose: () => void;
};

export const DeletePlayerModal: FC<Props> = memo((props) => {
	const navigate = useNavigate();
	const { name, isOpen, onClose } = props;
	const { showMessage } = useMessage();

	useEffect(() => {}, []);

	const onClickCancel = () => {
		onClose();
	};

	const onClickDeleteAccount = () => {
		axios
			.delete(`http://localhost:3001/players/${name}`)
			.then(() => {
				axios.delete(`http://localhost:3001/avatar/${name}`);
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
