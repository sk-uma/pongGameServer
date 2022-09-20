import { Box, Button, Flex, Text, useDisclosure } from "@chakra-ui/react";
import { ChangeEventHandler, memo, useCallback, useContext, useEffect, useState, VFC } from "react";
import { useAllPlayers } from "../../hooks/useAllPlayers";
import { useLoginPlayer } from "../../hooks/useLoginPlayer";
import { AddMemberModal } from "./modalWindow/addMemberModal";
import { ChatMemberModal } from "./modalWindow/roomMember";
import { ChatContext } from "./provider/ChatProvider";
import { ChatLogType, ChatRoomType } from "./type/ChatType";

type Props = {
    currentRoom : ChatRoomType;
    currentRoomId : string;
}

export const ChatRoomHeader: VFC<Props> = memo((props) => {

    const {currentRoom, currentRoomId} = props;
    const { getPlayers, players } = useAllPlayers();
    const [text, setText] = useState("");
    const logindata = useLoginPlayer();
    const { socket } = useContext(ChatContext);

    const {isOpen: isOpen1, onOpen: onOpen1, onClose: onClose1} = useDisclosure();
    const {isOpen: isOpen2, onOpen: onOpen2, onClose: onClose2} = useDisclosure();
    const onClickRoom1 = useCallback(() => onOpen1(), [onOpen1]);
    const onClickRoom2 = useCallback(() => onOpen2(), [onOpen2]);

    useEffect(() => {
		getPlayers();
	}, [getPlayers]);

    //const onChangeText = (e: ChangeEvent<HTMLInputElement>) => {
    //    setText(e.target.value);
    //}

    const onChangeTextarea: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
        setText(e.target.value);
    }

    const onClick = () => {
        let name: string;
        if (logindata && logindata.loginPlayer)
            name = logindata.loginPlayer.name;
        else
            name = "no name";

        const payload: ChatLogType = {
            roomId: currentRoomId,
            id: "new one", //import { v4 as uuidv4 } from 'uuid';
            owner: name,
            time: 'undefine',
            text: text,
            type: 'message',
        }
        console.log(currentRoomId);
        socket.emit('Chat/send/chatmessage', payload);

        setText("");
    }

    /*
            <Input
                placeholder="message..."
                bg="white"
                value={text}
                onChange={onChangeText}
                shadow="md"
            />
    */
    return (
        <Flex gap={1} justifyContent='center' alignItems='center' height='100%'>
            <Text fontSize="3xl" width="100%"># {currentRoom?.name}</Text>
            <Button
                onClick={onClickRoom1}
                colorScheme='teal'
                size='md'
                variant='outline'
                //leftIcon={<GiEarthAsiaOceania />}
                //onClick={onClickPublicRoom}
                width='70%'
            >
            view all members
                <ChatMemberModal isOpen={isOpen1} onClose={onClose1} room={currentRoom}></ChatMemberModal>
            </Button>

            <Button
                onClick={onClickRoom2}
                colorScheme='teal'
                size='md'
                variant='outline'
                //leftIcon={<GiEarthAsiaOceania />}
                //onClick={onClickPublicRoom}
                width='70%'
            >
            Add People
                <AddMemberModal isOpen={isOpen2} onClose={onClose2} room={currentRoom}></AddMemberModal>
            </Button>
        </Flex>
    );
})

