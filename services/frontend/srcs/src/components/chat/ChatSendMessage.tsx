import { Box, Button, Center, Flex, IconButton, Menu, MenuButton, MenuItem, MenuList, Text, Textarea } from "@chakra-ui/react";
import axios from "axios";
import { ChangeEventHandler, memo, useContext, useEffect, useState, VFC } from "react";
import { GiGamepad } from "react-icons/gi";
import { constUrl } from "../../constant/constUrl";
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
        if (text.trim() === '') {
            return ;
        }
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

    const onClickInvaitGame = (type: string) => {
        let name: string;
        if (logindata && logindata.loginPlayer)
            name = logindata.loginPlayer.name;
        else
            name = "no name";

        axios
            .get(constUrl.serversideUrl + '/game/privateKeyGen', {params: {
                user: name,
                gameType: type
            }})
            .then(
                function(response) {
                    // setPrivateKey(response.data.privateKey);

                    const payload: ChatLogType = {
                        roomId: currentRoomId,
                        id: "new one", //import { v4 as uuidv4 } from 'uuid';
                        owner: name,
                        time: 'undefine',
                        text: `${type}@${response.data.privateKey}`,
                        type: 'invite',
                    }
                    socket.emit('Chat/send/chatmessage', payload);
                }
            )
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
        <Center>
        <Flex style={{width: "calc(100% - 30px)"}}>
            <Textarea 
                placeholder="message..."
                bg="white"
                value={text}
                onChange={onChangeTextarea}
                shadow="md"
                style={{height: '90px'}}
            />
            <Box
                style={{
                    marginLeft: '5px',
                    height: '100px',
                    width: '75px'
                }}
            >
                <Menu>
                    <MenuButton
                        style={{width: '100%', marginBottom: '8px'}}
                        as={IconButton}
                        icon={<GiGamepad/>}
                        // variant="outline"
                    />
                    <MenuList>
                        <MenuItem onClick={() => onClickInvaitGame('pong')}>
                            <Text>invite to Pong</Text>
                        </MenuItem>
                        <MenuItem onClick={() => onClickInvaitGame('pongDX')}>
                            <Text>invite to PongDX</Text>
                            {/* invite to PongDX */}
                        </MenuItem>
                    </MenuList>
                </Menu>
                <Button
                bg="teal.400"
                color="white"
                width='100%'
                _hover={{ opacity: 0.8 }}
                //disabled={disabled}
                //isLoading={loading}
                onClick={onClick}
                >
                    Send
                </Button>            
            </Box>
        </Flex>
        </Center>
    );
})