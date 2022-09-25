import { Box, FormControl, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Stack } from "@chakra-ui/react";
import { memo, VFC } from "react";
import { useLoginPlayer } from "../../../hooks/useLoginPlayer";
import { ChatRoom } from "../ChatRoom";
import { ChatAllDataType } from "../type/ChatType";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    chatAllData: ChatAllDataType | undefined;
}

export const BrowseChannelsModal: VFC<Props> = memo((props) => {

    const {isOpen, onClose, chatAllData} = props;
    const logindata = useLoginPlayer();

    let browseChannel_list = undefined;
    if (chatAllData)
    {
        browseChannel_list = chatAllData.rooms.filter((room) => room.roomType === 'public');
    }

    return (
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>All public channels</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        <Stack>
                            <FormControl>
                                <Box width="100%" height="300" justifyContent='center' alignItems='center' overflowY='scroll'>
                                {
                                    browseChannel_list && 
                                    browseChannel_list.map((room, index) => {
                                        return (
                                            //<Box>{room.name}</Box>
                                            <Box key={index}>
                                                {   logindata && logindata.loginPlayer &&
                                                    <ChatRoom room={room} user={logindata.loginPlayer}/>
                                                }
                                            </Box>
                                        )
                                    })

                                    /*chatMembers.map((member, index) => {
                                        return (
                                            <Box key={index}>
                                                { <DmInviteUserCard
                                                    loginName={member.displayName}
                                                    displayName={member.displayName}
                                                    name={member.name}
                                                    level={member.level}
                                                    status={member.status}
                                                    imgUrl={member.imgUrl}
                                                    />}
                                            </Box>
                                        )
                                        //<Box key={index} fontSize='3xl'>{member}</Box>
                                    })*/
                                }
                                </Box>
                            </FormControl>
                        </Stack>
                    </ModalBody>
                </ModalContent>
            </Modal>
    );
});