import { Box, Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Select, Stack } from "@chakra-ui/react";
import { ChangeEvent, ChangeEventHandler, memo, useContext, useEffect, useState, VFC } from "react";
import { useAllPlayers } from "../../../hooks/useAllPlayers";
import { useLoginPlayer } from "../../../hooks/useLoginPlayer";
import { ChatContext } from "../provider/ChatProvider";
import { ChatAllDataType, ChatRoomType } from "../type/ChatType";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    roomId: string;
    chatAllData :ChatAllDataType | undefined;
}

export const ChatAddDirectMessageModal: VFC<Props> = memo((props) => {
    const { socket } = useContext(ChatContext);

    const {isOpen, onClose, roomId, chatAllData} = props;
    const [roomName, setRoomName] = useState("");
    const [password, setPassword] = useState("");
    const logindata = useLoginPlayer();
    const { getPlayers, players } = useAllPlayers();

    useEffect(() => {
		getPlayers();
        console.log(players);
	}, [getPlayers]);

    const [roomType, setRoomType] = useState("public");
    //const onChangeRoomType = (e: ChangeEvent<HTMLInputElement>) => {
    //    setRoomType(e.target.value);
    //}
    const onChangeRoomType: ChangeEventHandler<HTMLSelectElement> = (ev) => {
        setRoomType(ev.target.value);
    }

    //const onChangeRoomName = (e: ChangeEvent<HTMLInputElement>) => {
    //    setRoomName(e.target.value);
    //}

    let userName = 'default';
    if (logindata?.loginPlayer)
        userName = logindata?.loginPlayer?.name 

    const onClickAddChatRoom = async () => {

        if (!logindata || !logindata.loginPlayer)
            return ;
        const payload = {
            roomName: roomType,
            roomType: 'dm',
            password: '',
            invited: roomType,
            name: logindata.loginPlayer.name,//target
        }
        await socket.emit('Chat/generate/DmRoom', payload);        
        setRoomName("");
        setPassword("");
        onClose();
    };

    //自分以外
    let candidates_member = players.filter((member, index) => (member.name !== userName));
    //
    //既存ルーム一覧
    //const room = chatAllData?.rooms.find((room, index) => room.id === roomId);
    //if (room)
    //    candidates_member = candidates_member.filter((member, index) => (!room.member_list.includes(member.name) && !room.ban_list.includes(member.name)))
    //myDMroom取得
    let myDmRooms = chatAllData?.rooms.filter((room, index) =>
    room.roomType === 'dm' && room.member_list.includes(userName));
    //dm相手+自分
    let myDmOpponent_list: string[] = [];
    myDmOpponent_list.push(userName);
    if (myDmRooms)
    {
        myDmOpponent_list = myDmRooms?.map((room, index) => {
            //console.log(`${room.member_list} ${userName}`);
            if (room.member_list[0] === userName)
                return room.member_list[1];
            return room.member_list[0];});
        myDmOpponent_list.push(userName);
        //console.log(`0 ${myDmOpponent_list}`);
    }
    
    //それ以外
    candidates_member = candidates_member.filter((player, index) => !myDmOpponent_list.includes(player.name));
    //console.log(candidates_member);

    
    //console.log(candidates_member);
    //candidates_member = candidates_member.filter((member, index) => )

    return (
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>Direct Message</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        <Stack>
                            <FormControl>
                                <FormLabel>target</FormLabel>
                                <Select
                                    name='roomType'
                                    //defaultValue='pu'
                                    placeholder='Select target'
                                    onChange={onChangeRoomType}>
                                {
                                    candidates_member.map((member, index) => {
                                        return <option key={index} value={member.name}>{member.displayName}</option>
                                    })
                                }
                                </Select>
                                <Box>
                                    
                                </Box>
                            </FormControl>
                            <Button onClick={onClickAddChatRoom}>Start a new Message</Button>
                        </Stack>
                    </ModalBody>
                </ModalContent>
            </Modal>
    );
})