import { Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalHeader, ModalOverlay, Select, Stack } from "@chakra-ui/react";
import { ChangeEvent, ChangeEventHandler, memo, useContext, useState, VFC } from "react";
import { useLoginPlayer } from "../../../hooks/useLoginPlayer";
import { ChatContext } from "../provider/ChatProvider";

type Props = {
    isOpen: boolean;
    onClose: () => void;
}

export const ChatRoomAddModal: VFC<Props> = memo((props) => {
    const { socket } = useContext(ChatContext);

    const {isOpen, onClose } = props;
    const [roomName, setRoomName] = useState("");
    const [password, setPassword] = useState("");
    const logindata = useLoginPlayer();

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

        if (!logindata || !logindata.loginPlayer)
            return ;
        const payload = {
            roomName: roomName,
            roomType: roomType,
            password: password,
            name: logindata.loginPlayer.name,
        }
        await socket.emit('Chat/generate/room', payload);        
        setRoomName("");
        setPassword("");
        onClose();
    };
    return (
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay/>
                <ModalContent>
                    <ModalHeader>Add Channel</ModalHeader>
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
                                    defaultValue='public'
                                    //placeholder='Select option'
                                    onChange={onChangeRoomType}>
                                <option value='public'>public</option>
                                <option value='private'>private</option>
                                </Select>
                            </FormControl>
                            <FormControl>
                                <FormLabel>password</FormLabel>
                                <Input value={password} onChange={onChangePassword}/>
                            </FormControl>
                            <Button onClick={onClickAddChatRoom}>Add</Button>
                        </Stack>
                    </ModalBody>
                </ModalContent>
            </Modal>
    );
})