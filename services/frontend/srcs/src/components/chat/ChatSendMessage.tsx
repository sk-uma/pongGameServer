import { Button, Flex, Input, Textarea } from "@chakra-ui/react";
import { ChangeEvent, ChangeEventHandler, memo, useContext, useEffect, useState, VFC } from "react";
import { useAllPlayers } from "../../hooks/useAllPlayers";
import { useLoginPlayer } from "../../hooks/useLoginPlayer";
import { ChatContext } from "./provider/ChatProvider";
import { ChatLogType, ChatRoomType } from "./type/ChatType";

type Props = {
    currentRoom : ChatRoomType | undefined;
    currentRoomId : string;
}

export const ChatSendMessage: VFC<Props> = memo((props) => {

    const {currentRoom, currentRoomId} = props;
    const { getPlayers, players } = useAllPlayers();
    const [text, setText] = useState("");
    const logindata = useLoginPlayer();
    const { socket } = useContext(ChatContext);

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
        <Flex>
            <Textarea 
                placeholder="message..."
                bg="white"
                value={text}
                onChange={onChangeTextarea}
                shadow="md"/> 
            <Button
			bg="teal.400"
			color="white"
			_hover={{ opacity: 0.8 }}
			//disabled={disabled}
			//isLoading={loading}
			onClick={onClick}
		    >
                Send
		    </Button>            
        </Flex>
    );
})