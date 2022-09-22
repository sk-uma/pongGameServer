import { Box, Button, Link, useDisclosure, Text } from "@chakra-ui/react";
import axios from "axios";
import { memo, useCallback, VFC } from "react";
import { constUrl } from "../../constant/constUrl";
import { useLoginPlayer } from "../../hooks/useLoginPlayer";
import { BrowseChannelsModal } from "./modalWindow/BrowseChannelsModal";
import { ChatAddDirectMessageModal } from "./modalWindow/createDirectMessage";
import { ChatRoomAddModal } from "./modalWindow/createRoom";
import { InviteDmModal } from "./modalWindow/inviteDmModal";
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

//gray.300
//white
function PermissionTitle(props: {permission: String, color: string}) {
    return (
    <>
        <Box style={{marginTop: '10px'}}>
            <Text as="b" color={props.color}>
                {props.permission}
            </Text>
        </Box>
    </>
    );
}

export const ChatLeftTable: VFC<Props> = memo((props) => {
    const { LoadDataFlag, chatAllData,
            setCurrentRoomId, setCurrentRoom,
            currentRoomId, setChatData} = props;
    const logindata = useLoginPlayer();
    const {isOpen, onOpen, onClose} = useDisclosure();
    const {isOpen: isOpen2, onOpen: onOpen2, onClose: onClose2} = useDisclosure();
    const {isOpen: isOpen3, onOpen: onOpen3, onClose: onClose3} = useDisclosure();
    const onClickRoom = useCallback(() => onOpen(), [onOpen]);
    const onClickRoom2 = useCallback(() => onOpen2(), [onOpen2]);
    const onClickRoom3 = useCallback(() => onOpen3(), [onOpen3]);

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
            <PermissionTitle permission={' Channnels'} color={'gray.300'} />
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

            <Link onClick={onClickRoom3}>+ Browse channel
                <BrowseChannelsModal
                    isOpen={isOpen3} onClose={onClose3}
                    chatAllData={chatAllData}/>  
            </Link>

            <PermissionTitle permission={' Direct messages'} color={'gray.300'} />
            {
                chatAllData?.rooms.map((room, index) => {
                let name = logindata?.loginPlayer?.name;
                if (!name)
                    name = 'default';
                if (room.roomType !== 'dm')
                    return <Box key={index}></Box>
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
            <PermissionTitle permission={' Direct messages'} color={'gray.300'} />
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
                    return <Box key={index}></Box>
                }
                ;})
            }
            <Link onClick={onClickRoom2}>+ New message
                <InviteDmModal
                    isOpen={isOpen2} onClose={onClose2}
                    chatAllData={chatAllData}/>  
            </Link>
        </Box>
    );
});