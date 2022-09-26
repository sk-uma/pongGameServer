import { Box, Button, Center, Flex, Stack } from "@chakra-ui/react";
import { memo, useEffect, useRef, VFC } from "react";
import { FaArrowCircleDown } from "react-icons/fa";
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

    // const ref = createRef<HTMLDivElement>();
    // const scrollToBottomOfChat = useCallback(() => {
    //     // ref!.current!.scrollIntoView({
    //     //     behavior: 'smooth',
    //     //     block: 'start',
    //     // });
    //     ref!.current!.scrollIntoView(false);
    // }, [ref]);

    // useEffect(() => {
    //     scrollToBottomOfChat();
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, []);

    const bottom = useRef<null | HTMLDivElement>(null); 

    const scrollToBottom = () => {
        //bottom.current?.scrollIntoView({ behavior: "smooth" })
        bottom.current?.scrollIntoView();
    }

    useEffect(() => {
    scrollToBottom()
    });

    if (currentRoom && currentRoomId !== 'default' && chatAllData)
    {
        myMap = chatAllData.logs.filter((item) => item.roomId === currentRoomId)   
    }
    else
        return (<Box></Box>);

    return (
        //<Flex w="100%" h="70vh" maxHeight='70vh' overflowY="scroll" flexDirection="column">
        <>
        <Stack>
            {
                myMap.map((log, index) => {
                const usr = players.find((usr) => usr.name === log.owner);
                if (logindata?.loginPlayer?.blockList.includes(log.owner))
                    return <Flex key={index}></Flex>;
                if (currentRoom.mute_list.includes(log.owner) && logindata?.loginPlayer?.name !== log.owner)
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
                            <Box style={{width: 'calc(100% - 30px)'}}>
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
                            <Box style={{width: 'calc(100% - 30px)'}}>
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
            <div style={{height: '5px'}}></div>
        </Stack>
        <div ref={bottom}></div>
        {/* <div id="bottom-of-chat" ref={ref}>hello</div> */}
        </>
    );
})