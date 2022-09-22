import { Box, Center, Flex, Text } from "@chakra-ui/react";
import axios from "axios";
import { memo, useContext, useEffect, useState, VFC } from "react"
import { useLoginPlayer } from "../../hooks/useLoginPlayer";
import { ChatCenterHandle } from "./ChatCenterHandle";
import { ChatLeftTable } from "./ChatLeftTable";
import { ChatRight } from "./ChatRight";
import { ChatRoomHeader } from "./ChatRoomHeader";
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
            //setLoadDataFlag(new Date().toISOString());
            setChatData(ret);
            const room = ret.rooms.find((room) => room.id === currentRoom?.id)
            if (room)
            {
                setCurrentRoom(room);
                //setCurrentRoomId(room.id);
            }
            })                
        }, [socket, currentRoom]);

      const LoadDataFlag = () => {
          setLoadDataFlag(new Date().toISOString());
      } 

    //let Xname = "undifinedName";
    //if (logindata && logindata.loginPlayer)
    //  Xname = logindata.loginPlayer.name;

    return (
        <Flex width="100%" bg="ffffff">
            <Box width="25%" h="100vh" bg="#ff838b"
                sx={{
                    height: {
                        base: 'calc(100vh - 45.27px)',
                        md: 'calc(100vh - 61.59px)'
                    },
                }}
            >
                <ChatLeftTable
                    LoadDataFlag={LoadDataFlag}
                    chatAllData={chatData}
                    setCurrentRoomId={setCurrentRoomId}
                    setCurrentRoom={setCurrentRoom}
                    setChatData={setChatData}
                    currentRoomId={currentRoomId}
                    />
            </Box>
            <Box sx={{
                width: '75%',
                height: {
                    base: 'calc(100vh - 45.27px)',
                    md: 'calc(100vh - 61.59px)'
                },
                backgroundColor: 'white'
            }}>
                <Box
                    sx={{
                        height: '50px',
                        boxShadow: '0 4px 5px -5px rgba(0, 0, 0, .3)',
                        justifyContent: 'center',
                    }}
                >
                    {   currentRoom &&
                    <ChatRoomHeader currentRoom={currentRoom} currentRoomId={currentRoomId}/>
                    }
                </Box>
                <Flex height='calc(100% - 50px)'>
                    <Box sx={{
                        width: '100%',
                        fontSize: 'md',
                    }}>
                        <ChatCenterHandle
                            chatAllData={chatData}
                            currentRoom={currentRoom}
                            currentRoomId={currentRoomId}     
                            />
                    </Box>

                    {/* <Box width="230px" h="100%" borderWidth='0 0 0 0.5px'>
                    <ChatRight
                        chatAllData={chatData}
                        currentRoom={currentRoom}
                        currentRoomId={currentRoomId}/> 
                    </Box> */}
                </Flex>
            </Box>
        </Flex>
    )
});
