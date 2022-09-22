import { Box, Flex, Center, VStack, Text } from "@chakra-ui/react";
import chatInitIllust from './assets/chatInitIllust.svg';
import { memo, VFC } from "react";
import { ChatBrowseChannels } from "./ChatBrowseChannels";
import { ChatCenter } from "./ChatCenter";
import { ChatSendMessage } from "./ChatSendMessage";
import { ChatAllDataType, ChatRoomType } from "./type/ChatType";

type Props = {
    chatAllData :ChatAllDataType | undefined;
    currentRoom : ChatRoomType | undefined;
    currentRoomId : string;
}

export const ChatCenterHandle: VFC<Props> = memo((props) => {

    const {chatAllData, currentRoom, currentRoomId} = props;

    if (currentRoomId === 'default')
    {
        return (
            <Box height="100%">
                <Center height="100%" overflowY='scroll'>
                    <VStack spacing={5}>
                        <Text as="b" fontSize='3xl' color='#3f3d56'>
                            『 Chat 』へようこそ！
                        </Text>
                        {/* <Text color="gray.400">
                            右のチャンネルから他のプレイヤーと交流しましょう
                        </Text> */}
                        <img src={chatInitIllust} width='80%' style={{
                            width: '80%',
                            maxWidth: '800px',
                        }} />
                    </VStack>
                </Center>
            </Box>
        )
    }
    else if (currentRoomId === 'browseChannels')
    {
        return (
            <ChatBrowseChannels
                chatAllData={chatAllData}/> 
        )
    }
    return (
        <Box style={{height: '100%'}}>
            <Flex
                sx={{
                    width: '100%',
                    height: 'calc(100% - 100px)',
                    overflowY: 'scroll',
                    flexDirection: "column",
                }}
            >
            <ChatCenter
                chatAllData={chatAllData}
                currentRoom={currentRoom}
                currentRoomId={currentRoomId}
            />
            </Flex>
            <Box style={{bottom: '0px', height: '100px'}}>
                <ChatSendMessage
                currentRoom={currentRoom}
                currentRoomId={currentRoomId}/>  
            </Box>
        </Box>

    )
})