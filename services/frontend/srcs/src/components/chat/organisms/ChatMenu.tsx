import { Box, Link, Menu, MenuButton, MenuItem, MenuList, useDisclosure } from "@chakra-ui/react";
import { memo, useCallback, useContext, VFC } from "react";
import { useLoginPlayer } from "../../../hooks/useLoginPlayer";
import { TextSubHighlightStyle, TextSubStyle } from "../../atoms/TextStyle";
import { AddAdminModal } from "../modalWindow/addAdmin";
import { ChatBanModal } from "../modalWindow/chatBanModal";
import { ChatKickModal } from "../modalWindow/chatKick";
import { ChatMuteModal } from "../modalWindow/chatMute";
import { ChatRoomMenuModal } from "../modalWindow/handleRoom";
import { InvitePeopleModal } from "../modalWindow/invitePeople";
import { ChatContext } from "../provider/ChatProvider";
import { ChatRoomType } from "../type/ChatType";


type Props = {
    setCurrentRoomId : (roomid: string) => void;
    setCurrentRoom : (room: ChatRoomType) => void;
    room: ChatRoomType;
}

export const ChatRoomMenu: VFC<Props> = memo((props) => {
    const { setCurrentRoomId, setCurrentRoom, room
           } = props;

    const { socket } = useContext(ChatContext);

    const {isOpen: isOpen1, onOpen: onOpen1, onClose: onClose1} = useDisclosure();
    const {isOpen: isOpen2, onOpen: onOpen2, onClose: onClose2} = useDisclosure();
    const {isOpen: isOpen3, onOpen: onOpen3, onClose: onClose3} = useDisclosure();
    const {isOpen: isOpen4, onOpen: onOpen4, onClose: onClose4} = useDisclosure();
    const {isOpen: isOpen5, onOpen: onOpen5, onClose: onClose5} = useDisclosure();
    const {isOpen: isOpen6, onOpen: onOpen6, onClose: onClose6} = useDisclosure();
    const onClickRoom1 = useCallback(() => onOpen1(), [onOpen1]);
    const onClickRoom2 = useCallback(() => onOpen2(), [onOpen2]);
    const onClickRoom3 = useCallback(() => onOpen3(), [onOpen3]);
    const onClickRoom4 = useCallback(() => onOpen4(), [onOpen4]);
    const onClickRoom5 = useCallback(() => onOpen5(), [onOpen5]);
    const onClickRoom6 = useCallback(() => onOpen6(), [onOpen6]);

    const logindata = useLoginPlayer();

    let userName = logindata?.loginPlayer?.name;
    if (!userName)
        userName = 'default';

    const onClickRoomLink = (room: ChatRoomType) => {
        //alert(roominfo.name);
        setCurrentRoomId(room.id);
        setCurrentRoom(room);
    }

    const onClickDeleteRoom = async () => {

        if (!logindata || !logindata.loginPlayer)
            return ;
        const payload = {
            roomId: room.id,
            name: logindata.loginPlayer.name,
        }
        console.log(payload)
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
                <MenuButton>
                    <Link
                        onClick={() => onClickRoomLink(room)}
                        cursor='pointer'
                        >        
                        <TextSubHighlightStyle title={`# ${room.name}`}  color='gray.600'/>
                        <ChatRoomMenuModal isOpen={isOpen3} onClose={onClose3} room={room}/>     
                    </Link>
                </MenuButton>
                <MenuList>
                    <Box>
                    #{room.name}
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