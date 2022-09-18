import { Avatar, Box, Flex, Link } from "@chakra-ui/react";
import { memo, useEffect, VFC } from "react";
import { useAllPlayers } from "../../hooks/useAllPlayers";
import { ChatUserMenu } from "./organisms/ChatUserMenu";
import { ChatAllDataType, ChatLogType, ChatRoomType } from "./type/ChatType";

type Props = {
    chatAllData :ChatAllDataType | undefined;
    currentRoom : ChatRoomType | undefined;
    currentRoomId : string;
}

export const ChatRight: VFC<Props> = memo((props) => {

    const {chatAllData, currentRoom, currentRoomId} = props;
    const { getPlayers, players } = useAllPlayers();

    useEffect(() => {
		getPlayers();
	}, [getPlayers]);


    if (currentRoom && currentRoomId !== 'default' && chatAllData)
    {
    }
    else
        return (<Box></Box>);

    const owner_list = players.filter((item) => item.name === currentRoom.owner);
    const admin_list = players.filter((item) => currentRoom.admin_list.includes(item.name));
    const member_list =  players.filter((item) => currentRoom.member_list.includes(item.name));

    return (
        <Box>
            <Box>-- owener --</Box>
            {
                owner_list && owner_list[0].displayName
            }
            <Box>-- admin --</Box>
            {
                admin_list.map((member, index) => {
                    
                    return (
                        <Box key={index}> {member.displayName} </Box>
                    )
                })
            }
            <Box>-- member --</Box>
            {
                member_list.map((member, index) => {
                    return (
                        <Link key={index}>
                            <ChatUserMenu
                                opponentUser={member}
                                opponentName={member.name}
                                room={currentRoom}
                                />
                        </Link>
                    )
                })
            }
        </Box>
    );
})