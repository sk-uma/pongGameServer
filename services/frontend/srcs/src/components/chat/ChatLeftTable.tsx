import { Box, Button, Link, useDisclosure } from "@chakra-ui/react";
import axios from "axios";
import { memo, useCallback, VFC } from "react";
import { constUrl } from "../../constant/constUrl";
import { useLoginPlayer } from "../../hooks/useLoginPlayer";
import { ChatAddDirectMessageModal } from "./modalWindow/createDirectMessage";
import { ChatRoomAddModal } from "./modalWindow/createRoom";
import { ChatDmMenu } from "./organisms/ChatDmMenu";
import { ChatRoomMenu } from "./organisms/ChatMenu";
import { ChatAllDataType, ChatRoomType } from "./type/ChatType";

type Props = {
    LoadDataFlag : () => void;
    setCurrentRoomId : (roomid: string) => void;
    setCurrentRoom : (room: ChatRoomType) => void;
    chatAllData :ChatAllDataType | undefined;
    setChatData : (data: ChatAllDataType) => void;
    currentRoomId: string;
}

export const ChatLeftTable: VFC<Props> = memo((props) => {
    const { LoadDataFlag, chatAllData,
            setCurrentRoomId, setCurrentRoom,
            currentRoomId, setChatData} = props;
    const logindata = useLoginPlayer();
    const {isOpen, onOpen, onClose} = useDisclosure();
    const {isOpen: isOpen2, onOpen: onOpen2, onClose: onClose2} = useDisclosure();
    const onClickRoom = useCallback(() => onOpen(), [onOpen]);
    const onClickRoom2 = useCallback(() => onOpen2(), [onOpen2]);

    let name = 'default';
    if (logindata?.loginPlayer?.name)
        name = logindata?.loginPlayer?.name;

    const onClickRoomLink = (room: ChatRoomType) => {
        //alert(roominfo.name);
        setCurrentRoomId(room.id);
        setCurrentRoom(room);
        onClickVisitRoom(room);
    }

    const onClickVisitRoom = (room: ChatRoomType) => {
		axios
			.get(
				constUrl.serversideUrl +
					`/Chat/visitRoom?roomId=${room.id}&userName=${logindata?.loginPlayer?.name}`
			);

            if (room.notVisited_list.includes(name))
            {
                room.notVisited_list = room.notVisited_list.filter((item) => item !== name);
                let newRooms = chatAllData?.rooms;
                if (newRooms && chatAllData)
                {
                    const newRoom = newRooms.find((item) => item.id === room.id)
                    if (newRoom)
                    {
                        newRoom.notVisited_list = room.notVisited_list;
                        newRooms = newRooms.filter((item) => item.name !== newRoom.name)
                        newRooms.push(newRoom);
                        chatAllData.rooms = newRooms;
                        setChatData(chatAllData);
                    }
                }
            }
	};

    const onClickRoomLinkByName = (room: string) => {
        //alert(roominfo.name);
        setCurrentRoomId(room);
    }

    const onClickRightRoomLink = (room: string) => {
        alert(room);
        //setCurrentRoomId(room);
    }

    return (
        <Box>
            <Button size="xs" onClick={LoadDataFlag}>ping</Button>
            log {chatAllData?.logs.length}
            room {chatAllData?.rooms.length}
            <Box>== Channels </Box>
            {
                chatAllData?.rooms.map((room, index) => {
                let name = logindata?.loginPlayer?.name;
                if (!name)
                    name = 'default';
                if (room.roomType === 'dm')
                    return <Box key={index}></Box>
                if (room.member_list.includes(name)) {

                    if (currentRoomId !== room.id)
                    {
                        return (
                        <Box key={index}>
                        <Link
                            onClick={() => onClickRoomLink(room)}
                        ># {room.name}        
                        </Link>
                        </Box>
                        )
                    }
                    else {
                    return (
                        <Box key={index}>
                            <ChatRoomMenu
                                setCurrentRoomId={setCurrentRoomId}
                                setCurrentRoom={setCurrentRoom}
                                room={room}
                            />
                        </Box>
                    )
                    }
                }
                else {
                    return <Box key={index}></Box>
                }
                ;})
            }
            <Box><Link onClick={onClickRoom}>+ Create channel
                <ChatRoomAddModal isOpen={isOpen} onClose={onClose}/> 
            </Link></Box>

            <Box><Link onClick={() => onClickRoomLinkByName('browseChannels')}>+ Browse channels</Link></Box>

            <Box>== Direct messages </Box>
            {
                chatAllData?.rooms.map((room, index) => {
                let name = logindata?.loginPlayer?.name;
                if (!name)
                    name = 'default';
                if (room.roomType !== 'dm')
                    return <Box></Box>
                let opponentName = room.member_list[0];
                if (name === room.member_list[0])
                    opponentName = room.member_list[1];
                if (room.member_list.includes(name)) {

                    if (currentRoomId !== room.id)
                    {
                        return (
                        <Box key={index}>
                        { room.notVisited_list.includes(name) &&
                            <Link
                                onClick={() => onClickRoomLink(room)}
                                fontWeight={800}>
                                # {opponentName}        
                            </Link>
                        }
                        { !room.notVisited_list.includes(name) &&
                            <Link
                                onClick={() => onClickRoomLink(room)}
                                fontWeight={400}>
                                # {opponentName}        
                            </Link>
                        }
                        </Box>
                        )
                    }
                    else {
                    return (
                        <Box key={index}>
                            <ChatDmMenu
                                setCurrentRoomId={setCurrentRoomId}
                                setCurrentRoom={setCurrentRoom}
                                room={room}
                                opponentName={opponentName}
                            />
                        </Box>
                    )
                    }
                }
                else {
                    return <Box></Box>
                }
                ;})
            }
            <Link onClick={onClickRoom2}>+ New message
                <ChatAddDirectMessageModal
                    isOpen={isOpen2} onClose={onClose2}
                    roomId={currentRoomId} chatAllData={chatAllData}/> 
            </Link>
        </Box>
    );
});