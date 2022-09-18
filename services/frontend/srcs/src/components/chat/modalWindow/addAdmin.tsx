import { Box, Button, FormControl, FormLabel, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Select, Stack } from "@chakra-ui/react";
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

export const AddAdminModal: VFC<Props> = memo((props) => {
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
            player: logindata?.loginPlayer?.name,
            newAdmin: roomType,//target
        }
        await socket.emit('Chat/addAdmin', payload); 
        onClose();
    };

    const onClickKick2 = async () => {

        if (!logindata || !logindata.loginPlayer)
            return ;
        const payload = {
            roomId: room.id,
            player: logindata?.loginPlayer?.name,
            newAdmin: roomType,//target
        }
        await socket.emit('Chat/deleteAdmin', payload); 
        onClose();
    }; 

    let members2 = players.filter((item) => room.member_list.includes(item.name));
    let members = members2.filter((item) => !room.admin_list.includes(item.name));
    

    return (
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>Add Admin #{room.name}</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        <Stack>
                            <FormControl>
                                <FormLabel>add Admin</FormLabel>
                                <Select
                                    name='roomType'
                                    //defaultValue='pu'
                                    placeholder='Select target'
                                    onChange={onChangeRoomType}>
                                    {
                                    members.map((member, index) => {
                                        return <option value={member.name}>{member.displayName}</option>
                                    })
                                    }
                                </Select>
                            </FormControl>
                            <Button onClick={onClickKick}>Add</Button>
                        </Stack>
                        <Stack>
                            <FormControl>
                                <FormLabel>delete Admin</FormLabel>
                                <Select
                                    name='roomType'
                                    //defaultValue='pu'
                                    placeholder='Select target'
                                    onChange={onChangeRoomType}>
                                    {
                                    room.admin_list.map((member, index) => {
                                        return <option value={member}>{member}</option>
                                    })
                                    }
                                </Select>
                            </FormControl>
                            <Button onClick={onClickKick2}>delete</Button>
                        </Stack>

                    </ModalBody>
                </ModalContent>
            </Modal>
    );
});