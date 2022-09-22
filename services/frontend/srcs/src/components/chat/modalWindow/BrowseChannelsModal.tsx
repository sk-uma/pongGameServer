import { Box, Button, Flex, FormControl, FormLabel, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Select, Stack } from "@chakra-ui/react";
import { ChangeEventHandler, memo, useContext, useEffect, useState, VFC } from "react";
import { useAllPlayers } from "../../../hooks/useAllPlayers";
import { useLoginPlayer } from "../../../hooks/useLoginPlayer";
import { ChatRoom } from "../ChatRoom";
import { ChatUserCard } from "../organisms/ChatUserCard";
import { DmInviteUserCard } from "../organisms/DmInviteUserCard";
import { ChatContext } from "../provider/ChatProvider";
import { ChatAllDataType, ChatRoomType } from "../type/ChatType";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    chatAllData: ChatAllDataType | undefined;
}

export const BrowseChannelsModal: VFC<Props> = memo((props) => {
    const { socket } = useContext(ChatContext);

    const {isOpen, onClose, chatAllData} = props;
    const logindata = useLoginPlayer();
    const { getPlayers, players } = useAllPlayers();

    useEffect(() => {
		getPlayers();
	}, [getPlayers]);

    const [roomType, setRoomType] = useState("public");
    //const onChangeRoomType = (e: ChangeEvent<HTMLInputElement>) => {
    //    setRoomType(e.target.value);
    //}
    const onChangeRoomType: ChangeEventHandler<HTMLSelectElement> = (ev) => {
        setRoomType(ev.target.value);
    }

    let name = '';
    if (logindata && logindata.loginPlayer)
    {
        name = logindata.loginPlayer.name;
    }

    //const onChangeRoomName = (e: ChangeEvent<HTMLInputElement>) => {
    //    setRoomName(e.target.value);
    //}


    const onClickKick = async () => {

        if (!logindata || !logindata.loginPlayer)
            return ;
        const payload = {
            //roomId: room.id,
            player: logindata.loginPlayer.name,//target
            target: roomType,
        }
        await socket.emit('Chat/addMuteUser', payload); 
        onClose();
    };


    //let tmpMember = room.member_list.filter((item) => (item !== room.owner && !room.ban_list.includes(item)));
    //let members = tmpMember.filter((item) => item !== logindata?.loginPlayer?.name);

    //let members = players;

    let chatMembers = undefined;
    if (players)
    {
        let existDm_list: string[] = [];
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

    let browseChannel_list = undefined;
    if (chatAllData)
    {
        browseChannel_list = chatAllData.rooms.filter((room) => room.roomType !== 'dm');
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