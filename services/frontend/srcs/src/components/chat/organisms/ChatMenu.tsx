import { Box, Menu, MenuButton, MenuItem, MenuList, useDisclosure } from "@chakra-ui/react";
import { memo, useCallback, useContext, VFC } from "react";
import { useLoginPlayer } from "../../../hooks/useLoginPlayer";
import { TextSubHighlightStyle } from "../hooks/TextStyle";
import { ChatRoomMenuModal } from "../modalWindow/handleRoom";
import { ChatContext } from "../provider/ChatProvider";
import { ChatRoomType } from "../type/ChatType";


type Props = {
    setCurrentRoom : (room: ChatRoomType) => void;
    room: ChatRoomType;
}

export const ChatRoomMenu: VFC<Props> = memo((props) => {
    const { setCurrentRoom, room
           } = props;

    const { socket } = useContext(ChatContext);

    const {isOpen: isOpen3, onOpen: onOpen3, onClose: onClose3} = useDisclosure();
    const onClickRoom3 = useCallback(() => onOpen3(), [onOpen3]);

    const logindata = useLoginPlayer();

    let userName = logindata?.loginPlayer?.name;
    if (!userName)
        userName = 'default';

    const onClickRoomLink = (room: ChatRoomType) => {
        //alert(roominfo.name);
        setCurrentRoom(room);
    }

    const onClickDeleteRoom = async () => {

        if (!logindata || !logindata.loginPlayer)
            return ;
        const payload = {
            roomId: room.id,
            name: logindata.loginPlayer.name,
        }
        //console.log(payload)
        await socket.emit('Chat/delete/room', payload);        
        onClose3();
    };

    const onClickRoomLinkLeave = async (room: ChatRoomType) => {
        const payload = {
            roomId: room.id,
            name: logindata.loginPlayer?.name,
        }
        await socket.emit('Chat/send/leaveRoom', payload);
    }

    return (
        <Box  bg='teal.200'>
            <Menu>
                <MenuButton width='100%' textAlign='left'>
                    <Box
                        onClick={() => onClickRoomLink(room)}
                        cursor='pointer'  _hover={{bg:'teal.500'}}
                        >        
                        <TextSubHighlightStyle title={`# ${room.name}`}  color='gray.600'/>
                        <ChatRoomMenuModal isOpen={isOpen3} onClose={onClose3} room={room}/>     
                    </Box>
                </MenuButton>
                <MenuList>
                    <Box>
                    &nbsp;# {room.name}
                    </Box>
                    <MenuItem onClick={onClickRoom3}>
                        setting
                        <ChatRoomMenuModal isOpen={isOpen3} onClose={onClose3} room={room}/>     
                    </MenuItem>
                    { logindata?.loginPlayer?.name === room.owner &&
                        <MenuItem onClick={onClickDeleteRoom}>Delete</MenuItem>
                    }
                    { logindata?.loginPlayer?.name !== room.owner &&
                        <MenuItem onClick={() => onClickRoomLinkLeave(room)}>Leave</MenuItem>
                    }
                </MenuList>
            </Menu> 
        </Box>
    );
});