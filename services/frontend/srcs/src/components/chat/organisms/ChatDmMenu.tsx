import { Box, Link, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import { memo, useContext, VFC } from "react";
import { useLoginPlayer } from "../../../hooks/useLoginPlayer";
import { ChatContext } from "../provider/ChatProvider";
import { ChatRoomType } from "../type/ChatType";


type Props = {
    setCurrentRoomId : (roomid: string) => void;
    setCurrentRoom : (room: ChatRoomType) => void;
    room: ChatRoomType;
    opponentName: string;
}

export const ChatDmMenu: VFC<Props> = memo((props) => {
    const { setCurrentRoomId, setCurrentRoom, room, opponentName
           } = props;

    const { socket } = useContext(ChatContext);

    const logindata = useLoginPlayer();

    let userName = logindata?.loginPlayer?.name;
    if (!userName)
        userName = 'default';

    const onClickRoomLink = (room: ChatRoomType) => {
        setCurrentRoomId(room.id);
        setCurrentRoom(room);
    }

    const onClickDeleteRoom = async () => {

        if (!logindata || !logindata.loginPlayer)
            return ;
        const payload = {
            roomId: room.id,
            name: room.owner,
        }
        console.log(payload)
        await socket.emit('Chat/delete/room', payload);        
    };


    return (
        <Box>
            <Menu>
                <MenuButton>
                    <Link
                        onClick={() => onClickRoomLink(room)}
                        ># {opponentName}        
                    </Link>
                </MenuButton>
                <MenuList>
                    <Box>
                    # {opponentName}
                    </Box>
                    <MenuItem onClick={onClickDeleteRoom}>Leave</MenuItem>
                </MenuList>
            </Menu> 
        </Box>
    );
});