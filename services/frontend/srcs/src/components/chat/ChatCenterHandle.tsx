import { Box, Flex } from "@chakra-ui/react";
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
            <Box>init page</Box>
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
        <Box>
            <Flex w="100%" h="75vh" maxHeight='75vh' overflowY="scroll" flexDirection="column">
            <ChatCenter
                chatAllData={chatAllData}
                currentRoom={currentRoom}
                currentRoomId={currentRoomId}/>
            </Flex>
            <Box alignItems='flex-end' bg="#00ff99">
                <ChatSendMessage
                currentRoom={currentRoom}
                currentRoomId={currentRoomId}/>  
            </Box>
        </Box>

    )
})