import { Box, Button, Flex, HStack, Image, Input, Menu, MenuButton, MenuItem, MenuList, Text, useDisclosure } from "@chakra-ui/react";
import { ChangeEventHandler, memo, useCallback, useContext, useState, VFC } from "react";
import { useMessage } from "../../hooks/useMessage";
import { Player } from "../../types/api/Player";
import { useJoinRoom } from "./hooks/JoinRoom";
import { ChatContext } from "./provider/ChatProvider";
import { ChatRoomType } from "./type/ChatType";

type Props = {
    user?: Player;
    room: ChatRoomType;
}

/*<style>
.ex-button{
    border: 1px solid #333;
    padding:10px;
    background: #f2f2f2;
    display: inline-block;
    font-weight: bold;
    transition: .3s;
}
.ex-button:hover{
    background: yellow;
}*/

export const ChatRoom: VFC<Props> = memo((props) => {
    // console.log(props.log);
    let name = 'def';
    if (props.user)
    {
        name = props.user.name;
    }
    const { joinRoom, leaveRoom } = useJoinRoom(props.room, name);
    const { showMessage } = useMessage();
    const { socket } = useContext(ChatContext);
    const [text, setText] = useState("");
    const onChangeTextarea: ChangeEventHandler<HTMLInputElement> = (e) => {
        setText(e.target.value);
    }
    
    const joinPasswordRoom = () => {
        //alert(`${name} mute => ${target}`);
        
        if (props.room.password !== text)
        {
            setText("");
            showMessage({
                title: `Wrong password.`,
                status: "error",
            }); 
            return ;
        }
        const payload = {
            roomId: props.room.id,
            name: name,
        }
        socket.emit('Chat/send/joinRoom', payload); 
        showMessage({
            title: `joined room`,
            status: "success",
        });
	};
    
    return (
        <Flex style={{width: '100%'}} _hover={{ bg: "gray.100" }}>
            <Menu>
            <MenuButton>

            <Box>
                <Flex>
                    <HStack>
                        <Text as='b' size='md'>
                            # {props.room.name}
                        </Text>
                    </HStack>
                </Flex>
                <Flex>
                { props.room.member_list.includes(name) &&
                    <Text color='green'> joined. </Text>
                }
                <Text style={{whiteSpace: 'pre-wrap', width: '100%'}}>
                    {props.room.member_list.length} members  
                </Text>
               </Flex>
            </Box>

            </MenuButton>
            <MenuList>
            
            <Text as='b'># {props.room.name}</Text>

            { !props.room.member_list.includes(name)
                && props.room.roomType === 'public'
                && props.room.password !== ''
                &&
                <Box>
                <Input
                    placeholder="Password"
                    value={text}
                    onChange={onChangeTextarea}
                    shadow="md"/>
                <MenuItem onClick={() => joinPasswordRoom()}>
                    Join
                </MenuItem>
                </Box>
            }

            { !props.room.member_list.includes(name)
                && props.room.roomType === 'public'
                && props.room.password === ''
                &&
                <MenuItem onClick={() => joinRoom(name)}>
                    Join
                </MenuItem>
            }

            { props.room.member_list.includes(name) && 
                <MenuItem onClick={() => leaveRoom(name)}>
                    Leave
                </MenuItem>
            }

            </MenuList>
            </Menu>
        </Flex>
    );
});