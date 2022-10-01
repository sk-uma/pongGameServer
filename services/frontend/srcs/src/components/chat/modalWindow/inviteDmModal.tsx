import { Box, FormControl, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Stack } from "@chakra-ui/react";
import { memo, useEffect, VFC } from "react";
import { useAllPlayers } from "../../../hooks/useAllPlayers";
import { useLoginPlayer } from "../../../hooks/useLoginPlayer";
import { DmInviteUserCard } from "../organisms/DmInviteUserCard";
import { ChatAllDataType } from "../type/ChatType";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    chatAllData: ChatAllDataType | undefined;
}

export const InviteDmModal: VFC<Props> = memo((props) => {

    const {isOpen, onClose, chatAllData} = props;
    const logindata = useLoginPlayer();
    const { getPlayers, players } = useAllPlayers();

    useEffect(() => {
		getPlayers();
	}, [getPlayers, isOpen]);


    let name = '';
    if (logindata && logindata.loginPlayer)
    {
        name = logindata.loginPlayer.name;
    }

    //const onChangeRoomName = (e: ChangeEvent<HTMLInputElement>) => {
    //    setRoomName(e.target.value);
    //}


    //let tmpMember = room.member_list.filter((item) => (item !== room.owner && !room.ban_list.includes(item)));
    //let members = tmpMember.filter((item) => item !== logindata?.loginPlayer?.name);

    //let members = players;

    let chatMembers = undefined;
    if (players)
    {
        let existDm_list: string[] = [];
        existDm_list.push(name)
        if (chatAllData?.rooms)
        {
            for (let i = 0; i < chatAllData.rooms.length; i++)
            {
                let tmpRoom = chatAllData.rooms[i];
                if (tmpRoom.roomType !== 'dm' || !tmpRoom.member_list.includes(name))
                    continue;
                for (let j = 0; j < tmpRoom.member_list.length; j++)
                {
                    existDm_list.push(tmpRoom.member_list[j]);
                }
            }   
        }
        chatMembers = players.filter((member) => (!existDm_list.includes(member.name)));
    }
    return (
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader># DM</ModalHeader>
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
                                                { <DmInviteUserCard
                                                    loginName={member.displayName}
                                                    displayName={member.displayName}
                                                    name={member.name}
                                                    level={member.level}
                                                    status={member.status}
                                                    imgUrl={member.imgUrl}
                                                    win={member.win}
                                                    lose={member.lose}
                                                    exp={member.exp}
                                                    />}
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