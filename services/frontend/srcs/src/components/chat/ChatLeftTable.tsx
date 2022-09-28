import { Box, useDisclosure } from "@chakra-ui/react";
import { memo, useCallback, useContext, useEffect, VFC } from "react";
import { useAllPlayers } from "../../hooks/useAllPlayers";
import { useLoginPlayer } from "../../hooks/useLoginPlayer";
import { TextMainStyle, TextSubHighlightStyle, TextSubStyle } from "./hooks/TextStyle";
import { BrowseChannelsModal } from "./modalWindow/BrowseChannelsModal";
import { ChatRoomAddModal } from "./modalWindow/createRoom";
import { InviteDmModal } from "./modalWindow/inviteDmModal";
import { ChatDmMenu } from "./organisms/ChatDmMenu";
import { ChatRoomMenu } from "./organisms/ChatMenu";
import { ChatContext } from "./provider/ChatProvider";
import { ChatAllDataType, ChatRoomType } from "./type/ChatType";

type Props = {
    setCurrentRoomId : (roomid: string) => void;
    setCurrentRoom : (room: ChatRoomType) => void;
    chatAllData :ChatAllDataType | undefined;
    setChatData : (data: ChatAllDataType) => void;
    currentRoomId: string;
}

export const ChatLeftTable: VFC<Props> = memo((props) => {
    const { chatAllData,
            setCurrentRoomId, setCurrentRoom,
            currentRoomId } = props;
    const logindata = useLoginPlayer();
    const {isOpen, onOpen, onClose} = useDisclosure();
    const {isOpen: isOpen2, onOpen: onOpen2, onClose: onClose2} = useDisclosure();
    const {isOpen: isOpen3, onOpen: onOpen3, onClose: onClose3} = useDisclosure();
    const onClickRoom = useCallback(() => onOpen(), [onOpen]);
    const onClickRoom2 = useCallback(() => onOpen2(), [onOpen2]);
    const onClickRoom3 = useCallback(() => onOpen3(), [onOpen3]);
    const { getPlayers, players } = useAllPlayers();

    useEffect(() => {
		getPlayers();
	}, [getPlayers]);

    let name = 'default';
    if (logindata?.loginPlayer?.name)
        name = logindata?.loginPlayer?.name;
    const { socket } = useContext(ChatContext);

    const onClickRoomLink = (room: ChatRoomType) => {
        //alert(roominfo.name);
        setCurrentRoomId(room.id);
        setCurrentRoom(room);
        onClickVisitRoom(room);
    }

    const onClickVisitRoom = (room: ChatRoomType) => {
        if (room.notVisited_list.includes(name))
        {
            const payload = {
                roomId: room.id,
                userName: name,
            }
            socket.emit('Chat/visitRoom', payload)
		    /*axios
			.get(
				constUrl.serversideUrl +
					`/Chat/visitRoom?roomId=${room.id}&userName=${name}`
			);*/
        }
	};

    return (
        <Box>
            <TextMainStyle title={'Channnels'} color={'gray.300'}/>
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
                        { room.notVisited_list.includes(name) &&
                            <Box
                                onClick={() => onClickRoomLink(room)}
                                fontWeight={800}
                                cursor='pointer' _hover={{bg:'teal.500'}}>
                                <TextSubHighlightStyle title={`# ${room.name}`} color={'white'}/>
                            </Box>
                        }
                        { !room.notVisited_list.includes(name) &&
                            <Box
                                onClick={() => onClickRoomLink(room)}
                                fontWeight={400}
                                cursor='pointer'  _hover={{bg:'teal.500'}}>
                                <TextSubStyle title={`# ${room.name}`}/>
                            </Box>
                        }
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
            <Box onClick={onClickRoom} cursor='pointer'  _hover={{bg:'teal.500'}}>
                <TextSubStyle title={'+ Create channel'}/>
                <ChatRoomAddModal isOpen={isOpen} onClose={onClose}/> 
            </Box>

            <Box onClick={onClickRoom3}  cursor='pointer'  _hover={{bg:'teal.500'}}>
                <TextSubStyle title={'+ Browse channel'}/>
                <BrowseChannelsModal
                    isOpen={isOpen3} onClose={onClose3}
                    chatAllData={chatAllData}/>  
            </Box>

            <TextMainStyle title={'Direct messages'} color={'gray.300'}/>
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
                    let opponentDisplayName = players.find((player) => player.name === opponentName)?.displayName;
                if (!opponentDisplayName)
                    opponentDisplayName = 'default';
                if (room.member_list.includes(name)) {

                    if (currentRoomId !== room.id)
                    {
                        return (
                        <Box key={index}>
                        { room.notVisited_list.includes(name) &&
                            <Box
                                onClick={() => onClickRoomLink(room)}
                                fontWeight={800}
                                cursor='pointer' _hover={{bg:'teal.500'}}>
                                <TextSubHighlightStyle title={`# ${opponentDisplayName}`} color={'white'}/>
                            </Box>
                        }
                        { !room.notVisited_list.includes(name) &&
                            <Box
                                onClick={() => onClickRoomLink(room)}
                                fontWeight={400}
                                cursor='pointer'  _hover={{bg:'teal.500'}}>
                                <TextSubStyle title={`# ${opponentDisplayName}`}/>
                            </Box>
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
                                opponentName={opponentDisplayName}
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
            <Box onClick={onClickRoom2} cursor='pointer' _hover={{bg:'teal.500'}}>
                <TextSubStyle title={'+ New message'}/>
                <InviteDmModal
                    isOpen={isOpen2} onClose={onClose2}
                    chatAllData={chatAllData}/>  
            </Box>
        </Box>
    );
});