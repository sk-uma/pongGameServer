import { memo, FC } from "react";
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalBody,
	ModalHeader,
	ModalFooter,
} from "@chakra-ui/react";
import axios from "axios";

import { PrimaryButton } from "../../atoms/button/PrimaryButton";
import { constUrl } from "../../../constant/constUrl";
import { useGetPlayerwithToken } from "../../../hooks/useGetPlayerWithToken";

type Props = {
	name: string;
	isOpen: boolean;
	onClose: () => void;
};

export const WelcomMessageModal: FC<Props> = memo((props) => {
	const { getPlayerWithToken } = useGetPlayerwithToken();
	const { name, isOpen, onClose } = props;
	const onClickOK = () => {
		axios
			.patch(constUrl.serversideUrl + `/players/editrookie/${name}`)
			.then(() => {
				getPlayerWithToken();
			})
			.catch((e) => {
				console.log(e.response.data.message);
			});
		onClose();
	};

	return (
		<Modal isCentered isOpen={isOpen} onClose={onClose}>
			<ModalOverlay>
				<ModalContent>
					<ModalHeader>Don't want to edit your profile?</ModalHeader>
					<ModalBody fontSize={"xl"}>
						Click "Edit Profile"! You can change Player Name,
						Password and Avatar Image so on.
					</ModalBody>
					<ModalFooter>
						<PrimaryButton onClick={onClickOK}>
							Confirm
						</PrimaryButton>
					</ModalFooter>
				</ModalContent>
			</ModalOverlay>
		</Modal>
	);
});
