import { Button, Flex, Text, useDisclosure } from "@chakra-ui/react";
import { memo, useCallback, useEffect, VFC } from "react";
import { FaUserFriends, FaUserPlus } from "react-icons/fa";
import { useAllPlayers } from "../../hooks/useAllPlayers";
import { useLoginPlayer } from "../../hooks/useLoginPlayer";
import { AddMemberModal } from "./modalWindow/addMemberModal";
import { ChatMemberModal } from "./modalWindow/roomMember";
import { ChatAllDataType, ChatRoomType } from "./type/ChatType";

type Props = {
    chatAllData : ChatAllDataType | undefined;
    currentRoom : ChatRoomType;
    currentRoomId : string;
}

export const ChatRoomHeader: VFC<Props> = memo((props) => {

    const {currentRoom} = props;
    const { getPlayers, players } = useAllPlayers();
    const logindata = useLoginPlayer();

    const {isOpen: isOpen1, onOpen: onOpen1, onClose: onClose1} = useDisclosure();
    const {isOpen: isOpen2, onOpen: onOpen2, onClose: onClose2} = useDisclosure();
    const onClickRoom1 = useCallback(() => onOpen1(), [onOpen1]);
    const onClickRoom2 = useCallback(() => onOpen2(), [onOpen2]);

    useEffect(() => {
		getPlayers();
	}, [getPlayers]);

    //const onChangeText = (e: ChangeEvent<HTMLInputElement>) => {
    //    setText(e.target.value);
    //}

    /*
            <Input
                placeholder="message..."
                bg="white"
                value={text}
                onChange={onChangeText}
                shadow="md"
            />
    */
    let roomName = currentRoom.name;
    const name = logindata?.loginPlayer?.name;
    if (currentRoom && currentRoom.roomType === 'dm')
    {
        if (currentRoom && currentRoom.member_list[0] === name)
            roomName = currentRoom.member_list[1];
        else
            roomName = currentRoom.member_list[0];

        const player = players.find((player) => player.name === roomName)
        if (player)
            roomName = player.displayName;
    }

    return (
        <Flex gap={1} justifyContent='center' alignItems='center' height='100%'>
            <Text as="b" fontSize="3xl" width="100%"
                style={{
                    display: 'block',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                }}>&nbsp;# {roomName}</Text>
            <Button
                onClick={onClickRoom1}
                colorScheme='teal'
                size='md'
                variant='outline'
                rightIcon={<FaUserFriends />}
                //leftIcon={<GiEarthAsiaOceania />}
                //onClick={onClickPublicRoom}
                width='70%'
                style={{
                    display: 'block',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                }}
            >
            view all members
                <ChatMemberModal isOpen={isOpen1} onClose={onClose1} room={currentRoom}></ChatMemberModal>
            </Button>

            { currentRoom.roomType !== 'dm' &&
            <Button
                onClick={onClickRoom2}
                colorScheme='teal'
                size='md'
                variant='outline'
                rightIcon={<FaUserPlus />}
                //leftIcon={<GiEarthAsiaOceania />}
                //onClick={onClickPublicRoom}
                width='70%'
                style={{
                    display: 'block',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                }}
            >
            Add People
                <AddMemberModal isOpen={isOpen2} onClose={onClose2} room={currentRoom}></AddMemberModal>
            </Button>
            }
        </Flex>
    );
})

