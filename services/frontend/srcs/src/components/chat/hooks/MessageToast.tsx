import { memo, useCallback, useContext, VFC } from "react";
import { Flex, useToast, Image, HStack, Box, Text } from "@chakra-ui/react";
import { ChatLogType, ChatRoomType } from "../type/ChatType";
import { Player } from "../../../types/api/Player";
import { ChatContext } from "../provider/ChatProvider";
import { useLoginPlayer } from "../../../hooks/useLoginPlayer";

//chakra-uiのToast機能を使い、アクション終了後にメッセージをポップアップさせるhooks


type Props2 = {
    user?: Player;
    log: ChatLogType;
    room: ChatRoomType;
}

const ChatMessage: VFC<Props2> = memo((props) => {
    // console.log(props.log);

    return (
        <Flex style={{width: '100%'}}>
            <Image
                style={{
                    width: 50,
                    height: 50,
                    borderRadius: '12%',
                    marginRight: '6px',
                    marginTop: '6px',
                    objectFit: 'cover',
                }}
                src={props.user?.imgUrl}
                alt={props.user?.displayName}
            />
            <Box style={{width: 'calc(100% - 50px)'}}>
                <Flex>
                    <HStack>
                        <Text as='b' size='md'>
                            {props.user?.displayName}
                        </Text>
                        <Text as="b" size='md' style={{textAlign: 'end'}}>
                            { props.room.roomType !== 'dm' &&
                                <>&nbsp;&nbsp;# {props.room.name}</>}
                        </Text>
                    </HStack>
                </Flex>
                <Text style={{
                    //whiteSpace: 'pre-wrap',
                    width: '100%',
                    textAlign: 'justify',

                    display: 'block',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                }}>
                {   props.log.type === "invite" &&
                    `${props.user?.displayName} is inviting you to a pong`
                }
                {   props.log.type !== "invite" &&
                    `${props.log.text}`
                }
                </Text>
            </Box>
        </Flex>
    );
});

type Props = {
	title: string;
	status: "info" | "warning" | "success" | "error";
    log: ChatLogType;
    players: Player[];
    setCurrentRoom : (room: ChatRoomType) => void;
    room: ChatRoomType;
};

export const useChatMessage = () => {
	const toast = useToast();
    const { socket } = useContext(ChatContext);
    const logindata = useLoginPlayer();

    let name = 'default';
    if (logindata?.loginPlayer?.name)
        name = logindata?.loginPlayer?.name;

    const onClickCloseToast = useCallback((setCurrentRoom: (room: ChatRoomType) => void, room: ChatRoomType) => {
        setCurrentRoom(room);

        if (room.notVisited_list.includes(name))
        {
            const payload = {
                roomId: room.id,
                userName: name,
            }
            socket.emit('Chat/visitRoom', payload)
        }

        toast.closeAll();
    }, [toast, name, socket]);

	const showChatMessage = useCallback(
		(props: Props) => {
			const { title, status, log, players, setCurrentRoom, room } = props;
            const user = players.find((user) => user.name === log.owner)

			toast({
				title,
				status,
				position: "top",
				duration: 2000,
				isClosable: true,
                render: () => (
                    <Box
                        onClick={() => onClickCloseToast(setCurrentRoom, room)}
                        color='bray'
                        p={2}
                        bg="gray.100"
					    borderRadius="10px"
					    shadow="md">
                      <ChatMessage user={user} log={log} room={room}/>
                    </Box>
                  ),
			});
		},
		[toast, onClickCloseToast]
	);
	return { showChatMessage };
};