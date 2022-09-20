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
            {/* <Box alignItems='bottom' bg="#00ff99"> */}
                <ChatSendMessage
                currentRoom={currentRoom}
                currentRoomId={currentRoomId}/>  
            </Box>
        </Box>

    )
})