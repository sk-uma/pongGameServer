import { Button, Checkbox, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Select, Stack } from "@chakra-ui/react";
import { ChangeEvent, ChangeEventHandler, memo, useContext, useState, VFC } from "react";
import { useLoginPlayer } from "../../../hooks/useLoginPlayer";
import { useMessage } from "../../../hooks/useMessage";
import { ChatContext } from "../provider/ChatProvider";
import { ChatRoomType } from "../type/ChatType";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    room: ChatRoomType;
}

export const ChatRoomMenuModal: VFC<Props> = memo((props) => {
    const { socket } = useContext(ChatContext);

    const {isOpen, onClose, room} = props;
    const [roomName, setRoomName] = useState(room.name);
    const [password, setPassword] = useState("");
    const [checkedPassword, setCheckedPassword] = useState(false);

    const logindata = useLoginPlayer();
    const { showMessage } = useMessage();

    const [roomType, setRoomType] = useState("public");
    //const onChangeRoomType = (e: ChangeEvent<HTMLInputElement>) => {
    //    setRoomType(e.target.value);
    //}
    const onChangeRoomType: ChangeEventHandler<HTMLSelectElement> = (ev) => {
        setRoomType(ev.target.value);
    }

    const onChangeRoomName = (e: ChangeEvent<HTMLInputElement>) => {
        setRoomName(e.target.value);
    }

    const onChangePassword = (e: ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    }

    const onClickAddChatRoom = async () => {

        if (roomName === '')
        {
            showMessage({
                title: 'room name error',
                status: 'error'
            })
            return ;
        }
        if (roomName.length >= 20)
        {
            showMessage({
                title: 'room name error',
                status: 'error'
            })
            return ;
        }


        if (!logindata || !logindata.loginPlayer)
            return ;
        let newPass = room.password;
        if (checkedPassword)
            newPass = password;
        const payload = {
            roomId: room.id,
            roomName: roomName,
            roomType: roomType,
            password: newPass,
            name: logindata.loginPlayer.name,
        }
        //console.log(payload)
        await socket.emit('Chat/fix/room', payload);        
        //setRoomName("");
        //setPassword("");
        onClose();
    };

    const onClickDeleteRoom = async () => {

        if (!logindata || !logindata.loginPlayer)
            return ;
        const payload = {
            roomId: room.id,
            name: logindata.loginPlayer.name,
        }
        //console.log(payload)
        await socket.emit('Chat/delete/room', payload);        
        //setRoomName("");
        //setPassword("");
        onClose();
    };

    let name = logindata?.loginPlayer?.name;

    if (!name || !(room.owner === name))
    {
        return (
            <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay/>
            <ModalContent>
                <ModalHeader>Setting #{room.name}</ModalHeader>
                <ModalBody>
                <FormLabel>
                    {room.roomType} channel
                </FormLabel>
                { room.password !== '' &&
                    <FormLabel>
                        password protected
                    </FormLabel>
                }
                </ModalBody>
            </ModalContent>
        </Modal> 
        )
    }

    return (
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>Setting #{room.name}</ModalHeader>
                    <ModalCloseButton/>
                    <ModalBody>
                        <Stack>
                            <FormControl>
                                <FormLabel>channel name</FormLabel>
                                <Input value={roomName} onChange={onChangeRoomName}/>
                            </FormControl>
                            <FormControl>
                                <FormLabel>type</FormLabel>
                                <Select
                                    name='roomType'
                                    defaultValue={room.roomType}
                                    //placeholder='change room type'
                                    onChange={onChangeRoomType}>
                                <option value='public'>public</option>
                                <option value='private'>private</option>
                                </Select>
                            </FormControl>
                            <FormControl>
                                { room.password !== '' &&
                                    <FormLabel>
                                        password protected
                                    </FormLabel>
                                }
                                <Checkbox isChecked={checkedPassword} onChange={e => setCheckedPassword(e.target.checked)}>
                                    <FormLabel>set a new password</FormLabel>
                                </Checkbox>
                                <Input value={password} onChange={onChangePassword}/>
                            </FormControl>
                            <Button onClick={onClickAddChatRoom}>Save</Button>
                            {logindata?.loginPlayer?.name===room.owner && <Button onClick={onClickDeleteRoom}>Delete Channel</Button>}
                        </Stack>
                    </ModalBody>
                </ModalContent>
            </Modal>
    );
})