import { Box, Flex } from "@chakra-ui/react";
import axios from "axios";
import { memo, useContext, useEffect, useState, VFC } from "react"
import { useLoginPlayer } from "../../hooks/useLoginPlayer";
import { ChatCenterHandle } from "./ChatCenterHandle";
import { ChatLeftTable } from "./ChatLeftTable";
import { ChatRight } from "./ChatRight";
import { ChatContext } from "./provider/ChatProvider";
import { ChatAllDataType, ChatRoomType } from "./type/ChatType";

export const ChatHome: VFC = memo(() => {
    const { socket } = useContext(ChatContext);
    const logindata = useLoginPlayer();
    const [loadDataFlag, setLoadDataFlag] = useState<string>("");
    const [chatData, setChatData] = useState<ChatAllDataType>();
    const [currentRoomId, setCurrentRoomId] = useState<string>("default");
    const [currentRoom, setCurrentRoom] = useState<ChatRoomType | undefined>(undefined);
    
    //const { getAllChatData, allChatData } = useAllChatData();

    useEffect(() => {
        socket.on('connect', () => {
        });
    
        socket.on('disconnect', () => {
        });
 
        const registUser = () => {
            let name = "undefinedName";
            if (logindata && logindata.loginPlayer)
            {
                console.log('login');
                console.log(logindata);
                name = logindata.loginPlayer.name;
            }
            socket.emit('Chat/userConnect', name);
          }
        
        registUser();
        //getAllChatData();
        //console.log(allChatData);

        return () => {
          socket.off('connect');
          socket.off('disconnect');
          //socket.off('Chat/pong');
        };

      }, [socket, logindata]);

      useEffect(() => {
        const getChatData = async () => {
          const response = await axios.get<ChatAllDataType>('http://localhost:3001/chat/getAllData');
          console.log('axios')
          console.log(response.data)
          /*response.data.rooms.sort(function(first, second){
              if (first.name < second.name) {
                  return -1;
              } else if (first.name > second.name) {
                  return 1;
              } else {
                  return 0;
              }
          });*/
          setChatData(response.data);
        }
        getChatData();
      }, [loadDataFlag])

        //データ取得用　flagを立てる。
        useEffect(() => {
            socket.on('Chat/recv', (ret: ChatAllDataType) => {
            console.log('Chat/recv')
            console.log(ret);
            //LoadDataFlag();
            setLoadDataFlag(new Date().toISOString());
            })                
        }, [socket]);

      const LoadDataFlag = () => {
          setLoadDataFlag(new Date().toISOString());
      } 

    //let Xname = "undifinedName";
    //if (logindata && logindata.loginPlayer)
    //  Xname = logindata.loginPlayer.name;

    return (
        <Flex width="100%" bg="ffffff">
            <Box width="25%" h="100vh" bg="#ff838b">
                <ChatLeftTable
                    LoadDataFlag={LoadDataFlag}
                    chatAllData={chatData}
                    setCurrentRoomId={setCurrentRoomId}
                    setCurrentRoom={setCurrentRoom}
                    setChatData={setChatData}
                    currentRoomId={currentRoomId}
                    />
            </Box>
            <Box width="75%" h="100vh" bg="#ffffff">
            {/* <Box width="75%" h="100vh" bg="#00eeee"> */}
                <Box bg="#aa0000">roomName {currentRoom?.name} {logindata?.loginPlayer?.name}</Box>
                <Flex>
                    <Box width="70%" h="100vh">
                            
                    <ChatCenterHandle
                        chatAllData={chatData}
                        currentRoom={currentRoom}
                        currentRoomId={currentRoomId}     
                        />
                    </Box>

                    <Box width="30%" h="100vh" bg="#00ff00">
                    <ChatRight
                        chatAllData={chatData}
                        currentRoom={currentRoom}
                        currentRoomId={currentRoomId}/> 
                    </Box>
                </Flex>
            </Box>
        </Flex>
    )
});