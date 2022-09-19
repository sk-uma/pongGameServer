import { Box, Button, Flex, FormControl, FormLabel, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Select, Stack } from "@chakra-ui/react";
import { ChangeEventHandler, memo, useContext, useEffect, useState, VFC } from "react";
import { useAllPlayers } from "../../../hooks/useAllPlayers";
import { useLoginPlayer } from "../../../hooks/useLoginPlayer";
import { ChatContext } from "../provider/ChatProvider";
import { ChatRoomType } from "../type/ChatType";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    room: ChatRoomType;
}

export const ChatBanModal: VFC<Props> = memo((props) => {
    const { socket } = useContext(ChatContext);

    const {isOpen, onClose, room} = props;
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

    //const onChangeRoomName = (e: ChangeEvent<HTMLInputElement>) => {
    //    setRoomName(e.target.value);
    //}


    const onClickKick = async () => {

        if (!logindata || !logindata.loginPlayer)
            return ;
        const payload = {
            roomId: room.id,
            player: logindata.loginPlayer.name,//target
            target: roomType,
        }
        await socket.emit('Chat/addBanUser', payload); 
        const payload2 = {
            roomId: room.id,
            target: roomType,
            name: logindata.loginPlayer.name,//target
        }
        await socket.emit('Chat/delete/roomMember', payload2);
        onClose();
    };

    const onClickKick2 = async () => {

        if (!logindata || !logindata.loginPlayer)
            return ;
        const payload = {
            roomId: room.id,
            player: logindata.loginPlayer.name,//target
            target: roomType,
        }
        await socket.emit('Chat/UnbanUser', payload); 
        onClose();
    };

    let tmpMember = room.member_list.filter((item) => (item !== room.owner && !room.ban_list.includes(item)));
    let members = tmpMember.filter((item) => item !== logindata?.loginPlayer?.name);

    return (
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>Ban  #{room.name}</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        <Stack>
                            <FormControl>
                                <FormLabel>Ban User</FormLabel>

                                
                                <Select
                                    name='roomType'
                                    //defaultValue='pu'
                                    placeholder='Select target'
                                    onChange={onChangeRoomType}>
                                {
                                    members.map((member, index) => {
                                        return <option value={member}>{member}</option>
                                    })
                                }
                                </Select>
                                </FormControl>
                                    <Button onClick={onClickKick}>Ban</Button>
                                <FormControl>
                                

                                <FormLabel>Unban User</FormLabel>
                                <Select
                                    name='roomType'
                                    //defaultValue='pu'
                                    placeholder='Select target'
                                    onChange={onChangeRoomType}>
                                {
                                    room.ban_list.map((member, index) => {
                                        return <option value={member}>{member}</option>
                                    })
                                }
                                </Select>
                                <Box>
                                    
                                </Box>
                            </FormControl>
                            <Button onClick={onClickKick2}>Unban</Button>
                        </Stack>
                    </ModalBody>
                </ModalContent>
            </Modal>
    );
});