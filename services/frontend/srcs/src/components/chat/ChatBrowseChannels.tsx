import { Box, Button, Flex } from "@chakra-ui/react";
import { memo, useContext, VFC } from "react";
import { useLoginPlayer } from "../../hooks/useLoginPlayer";
import { ChatContext } from "./provider/ChatProvider";
import { ChatAllDataType, ChatRoomType } from "./type/ChatType";

type Props = {
    chatAllData :ChatAllDataType | undefined;
}

export const ChatBrowseChannels: VFC<Props> = memo((props) => {

    const {chatAllData} = props;
    const { socket } = useContext(ChatContext);
    const logindata = useLoginPlayer();

    const onClickRoomLinkJoin = async (room: ChatRoomType) => {
        const payload = {
            roomId: room.id,
            name: logindata.loginPlayer?.name,
        }
        await socket.emit('Chat/send/joinRoom', payload);
    }
    const onClickRoomLinkLeave = async (room: ChatRoomType) => {
        const payload = {
            roomId: room.id,
            name: logindata.loginPlayer?.name,
        }
        await socket.emit('Chat/send/leaveRoom', payload);
    }

    return (
        <Box>
        {
            chatAllData?.rooms.map((room, index) => {
                let name = logindata?.loginPlayer?.name;
                if (!name)
                    name = 'default';
                if (room.roomType !== 'public')
                {
                    return ( <Box></Box> )
                }
                return (
                    <Flex key={index}>
                        {room.name}
                        <Button onClick={() => onClickRoomLinkJoin(room)}>join</Button>
                        <Button onClick={() => onClickRoomLinkLeave(room)}>leave</Button>
                        <Box>{room.roomType} </Box>
                        { room.member_list.includes(name) &&
                            <Box>,joined</Box>
                        }
                        { room.ban_list.includes(name) &&
                            <Box>,banned</Box>
                        }
                        { room.password.length !== 0 &&
                            <Box>,pass "{room.password}"</Box>
                        }
                    </Flex>
                )
            })
        }
        </Box>
    )
})