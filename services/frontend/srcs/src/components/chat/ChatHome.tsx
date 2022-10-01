import { Box, Flex } from "@chakra-ui/react";
import axios from "axios";
import { memo, useContext, useEffect, useState, VFC } from "react"
import { constUrl } from "../../constant/constUrl";
import { useAllPlayers } from "../../hooks/useAllPlayers";
import { useLoginPlayer } from "../../hooks/useLoginPlayer";
import { ChatCenterHandle } from "./ChatCenterHandle";
import { ChatLeftTable } from "./ChatLeftTable";
import { ChatRoomHeader } from "./ChatRoomHeader";
import { useChatMessage } from "./hooks/MessageToast";
import { ChatContext } from "./provider/ChatProvider";
import { ChatAllDataType, ChatLogType, ChatRoomType } from "./type/ChatType";

export const ChatHome: VFC = memo(() => {
    const { socket } = useContext(ChatContext);
    const [chatData, setChatData] = useState<ChatAllDataType>();
    const [currentRoom, setCurrentRoom] = useState<ChatRoomType | undefined>(undefined);
    const { showChatMessage } = useChatMessage();
    const { getPlayers, players } = useAllPlayers();

    useEffect(() => {
		getPlayers();
	}, [getPlayers]);

    //const { getAllChatData, allChatData } = useAllChatData();
    const logindata = useLoginPlayer();
    let UserName = '';
    if (logindata && logindata.loginPlayer)
        UserName = logindata.loginPlayer.name;

    useEffect(() => {
        socket.on('connect', () => {
        });
    
        socket.on('disconnect', () => {
        });
 
        /*const registUser = () => {
            let name = "undefinedName";
            if (logindata && logindata.loginPlayer)
            {
                console.log('login');
                console.log(logindata);
                name = logindata.loginPlayer.name;
            }
            socket.emit('Chat/userConnect', name);
          }*/
        
        //registUser();
        //getAllChatData();
        //console.log(allChatData);

        socket.on('Chat/recv', (ret: ChatAllDataType) => {
            //console.log('Chat/recv')
            //console.log(ret);
            //LoadDataFlag();
            //setLoadDataFlag(new Date().toISOString());
            ret.rooms.sort(function (a, b) {
                return a.id > b.id ? -1: 1;
            })
            setChatData(ret);
            const room = ret.rooms.find((room) => room.id === currentRoom?.id)
            if (room)
            {
                if (!room.member_list.includes(UserName))
                {
                    setCurrentRoom(undefined);    
                }
                else
                {
                    setCurrentRoom(room);
                }
            }
            else
            {
                setCurrentRoom(undefined);
            }
            if (currentRoom !== undefined && room
                && room.notVisited_list.includes(UserName))
            {
                const payload = {
                    roomId: room.id,
                    userName: UserName,
                }
                socket.emit('Chat/visitRoom', payload)    
            }
        })

        socket.on('Chat/notification', (ret: ChatLogType) => {
            //console.log('Chat/notification')
            //console.log(ret);
            if (ret && logindata?.loginPlayer?.name !== ret.owner
                && (currentRoom === undefined || currentRoom.id !== ret.roomId)
                )
            {
                const logRoom = chatData?.rooms.find((room) => room.id === ret.roomId);
                if (logRoom && !logRoom.mute_list.includes(ret.owner)
                    && !logindata.loginPlayer?.blockList.includes(ret.owner))
                {
                    showChatMessage({
                        title: `aaa`,
                        status: 'info',
                        log: ret,
                        players: players,
                        setCurrentRoom: setCurrentRoom,
                        room: logRoom,
                    })
                }
            }
            
            //LoadDataFlag();
            //setLoadDataFlag(new Date().toISOString());
        })

        return () => {
          socket.off('connect');
          socket.off('disconnect');
          socket.off('Chat/recv');
          socket.off('Chat/notification');
          //socket.off('Chat/pong');
        };

      });

      
      useEffect(() => {
        const payload = {
            name: UserName
        }
        socket.emit('Chat/connect/server', payload); 
        return () => {
            socket.off('Chat/connect/server');
          };
      }, [UserName, socket]);

      useEffect(() => {
        const getChatData = async () => {
          const response = await axios.get<ChatAllDataType>(constUrl.serversideUrl + `/chat/getAllData`);
          //console.log('axios')
          //console.log(response.data)
            response.data.rooms.sort(function (a, b) {
            return a.id > b.id ? -1: 1;
            })
          setChatData(response.data);
        }
        getChatData();

      }, [])

        //データ取得用　flagを立てる。
       /* useEffect(() => {
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
        }, [socket, currentRoom]);*/


    //let Xname = "undifinedName";
    //if (logindata && logindata.loginPlayer)
    //  Xname = logindata.loginPlayer.name;
    return (
        <Flex width="100%" bg="ffffff">
            <Box width="25%" h="100vh" bg="teal"
                sx={{
                    height: {
                        base: 'calc(100vh - 45.27px)',
                        md: 'calc(100vh - 61.59px)'
                    },
                    overflowY: 'scroll',
                    flexDirection: "column",
                }}
            >
                <ChatLeftTable
                    chatAllData={chatData}
                    setCurrentRoom={setCurrentRoom}
                    setChatData={setChatData}
                    currentRoom={currentRoom}
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
                    <ChatRoomHeader chatAllData={chatData} currentRoom={currentRoom}/>
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
