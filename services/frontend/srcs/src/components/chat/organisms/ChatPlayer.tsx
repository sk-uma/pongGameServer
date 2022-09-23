import { Box, Link, Menu, MenuButton, MenuItem, Text, MenuList, useDisclosure } from "@chakra-ui/react";
import { memo, useCallback, useContext, VFC } from "react";
import { useLoginPlayer } from "../../../hooks/useLoginPlayer";
import { AddAdminModal } from "../modalWindow/addAdmin";
import { ChatKickModal } from "../modalWindow/chatKick";
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
    const onClickRoom1 = useCallback(() => onOpen1(), [onOpen1]);
    const onClickRoom2 = useCallback(() => onOpen2(), [onOpen2]);
    const onClickRoom3 = useCallback(() => onOpen3(), [onOpen3]);
    const onClickRoom4 = useCallback(() => onOpen4(), [onOpen4]);

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
        <Box>
            <Menu>
                <MenuButton>
                    <Link
                        onClick={() => onClickRoomLink(room)}
                        ># {room.name}        
                        <ChatRoomMenuModal isOpen={isOpen3} onClose={onClose3} room={room}/>     
                    </Link>
                </MenuButton>
                <MenuList>
                    <Text as='b'># {room.name}</Text>
                    <MenuItem onClick={onClickRoom1}>
                        Invite People
                        <InvitePeopleModal isOpen={isOpen1} onClose={onClose1} room={room}/>
                    </MenuItem>
                    <MenuItem onClick={onClickRoom3}>
                        setting
                        <ChatRoomMenuModal isOpen={isOpen3} onClose={onClose3} room={room}/>     
                    </MenuItem>
                    { (logindata?.loginPlayer?.name === room.owner || room.admin_list.includes(userName)) &&
                        <MenuItem onClick={onClickRoom4}>Add admin
                            <AddAdminModal isOpen={isOpen4} onClose={onClose4} room={room}/> 
                        </MenuItem>
                    }   
                    { (logindata?.loginPlayer?.name === room.owner || room.admin_list.includes(userName)) &&
                        <MenuItem onClick={onClickRoom2}>Kick Someone
                            <ChatKickModal isOpen={isOpen2} onClose={onClose2} room={room}/>
                        </MenuItem>
                    }             
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