import { Box, FormControl, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Stack } from "@chakra-ui/react";
import { ChangeEventHandler, memo, useContext, useEffect, useState, VFC } from "react";
import { useAllPlayers } from "../../../hooks/useAllPlayers";
import { useLoginPlayer } from "../../../hooks/useLoginPlayer";
import { AddUserCard } from "../organisms/AddUserCard";
import { ChatContext } from "../provider/ChatProvider";
import { ChatRoomType } from "../type/ChatType";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    room: ChatRoomType;
}

export const AddMemberModal: VFC<Props> = memo((props) => {

    const {isOpen, onClose, room} = props;
    const { getPlayers, players } = useAllPlayers();

    useEffect(() => {
		getPlayers();
	}, [getPlayers]);

    let chatMembers = undefined;
    if (players)
    {
        chatMembers = players.filter((item) => (!room.member_list.includes(item.name)))
    }
    return (
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>Invite Prople</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        <Stack>
                            <FormControl>
                                <Box width="100%" height="300" justifyContent='center' alignItems='center' overflowY='scroll'>
                                {
                                    chatMembers &&
                                    chatMembers.map((member, index) => {
                                        return (
                                            <Box key={index}>
                                                <AddUserCard
                                                    loginName={member.displayName}
                                                    displayName={member.displayName}
                                                    name={member.name}
                                                    level={member.level}
                                                    status={member.status}
                                                    imgUrl={member.imgUrl}
                                                    win={member.win}
                                                    lose={member.lose}
                                                    exp={member.exp}
                                                    room={room}/>  
                                            </Box>
                                        )
                                        //<Box key={index} fontSize='3xl'>{member}</Box>
                                    })
                                }
                                </Box>
                            </FormControl>
                        </Stack>
                    </ModalBody>
                </ModalContent>
            </Modal>
    );
});