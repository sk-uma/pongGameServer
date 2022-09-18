import { Avatar, Box, Center, Flex, Stack } from "@chakra-ui/react";
import { memo, useEffect, VFC } from "react";
import { useAllPlayers } from "../../hooks/useAllPlayers";
import { useLoginPlayer } from "../../hooks/useLoginPlayer";
import { ChartInvaitChatMessage } from "./ChatInviteGameMessage";
import { ChatMessage } from "./ChatMessage";
import { ChatAllDataType, ChatLogType, ChatRoomType } from "./type/ChatType";

type Props = {
    chatAllData :ChatAllDataType | undefined;
    currentRoom : ChatRoomType | undefined;
    currentRoomId : string;
}

export const ChatCenter: VFC<Props> = memo((props) => {

    const {chatAllData, currentRoom, currentRoomId} = props;
    const { getPlayers, players } = useAllPlayers();
    const logindata = useLoginPlayer();

    useEffect(() => {
		getPlayers();
	}, [getPlayers]);

    let myMap: ChatLogType[] = [];

    if (currentRoom && currentRoomId !== 'default' && chatAllData)
    {
        myMap = chatAllData.logs.filter((item) => item.roomId === currentRoomId)   
    }
    else
        return (<Box></Box>);

    return (
        //<Flex w="100%" h="70vh" maxHeight='70vh' overflowY="scroll" flexDirection="column">
        <Stack>
            {
                myMap.map((log, index) => {
                const usr = players.find((usr) => usr.name === log.owner);
                if (logindata?.loginPlayer?.blockList.includes(log.owner))
                    return <Flex key={index}></Flex>;
                if (log.type === "message") {
                    return (
                        // <Flex key={index}  w="100%">
                        //     <Avatar name={usr?.name}/>
                        //     <Box>
                        //         <Flex>
                        //             <Box> {log.owner} </Box>
                        //             <Box> : {log.time} </Box>
                        //         </Flex>
                        //         <Box> {log.text} </Box>
                        //     </Box>
                        // </Flex>
                        <Center key={index}>
                            <Box style={{width: '95%'}}>
                                <ChatMessage
                                    user={usr}
                                    log={log}
                                />
                            </Box>
                        </Center>
                    )
                } else if (log.type === "invite") {
                    return (
                        <Center key={index}>
                            <Box style={{width: '95%'}}>
                                <ChartInvaitChatMessage
                                    user={usr}
                                    log={log}
                                    isOwn={logindata?.loginPlayer?.name === log.owner}
                                />
                            </Box>
                        </Center>
                    )
                }
                })
            }
        </Stack>
    );
})