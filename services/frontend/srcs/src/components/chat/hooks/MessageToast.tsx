import { memo, useCallback, VFC } from "react";
import { Flex, useToast, Image, HStack, Box, Text } from "@chakra-ui/react";
import { ChatLogType } from "../type/ChatType";
import { Player } from "../../../types/api/Player";

//chakra-uiのToast機能を使い、アクション終了後にメッセージをポップアップさせるhooks


type Props2 = {
    user?: Player;
    log: ChatLogType;
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
                        <Text as="sub" color='gray' style={{marginBottom: '4px'}}>
                            {props.log.time.slice(0, 10) + ' ' + props.log.time.slice(11, 16)}
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
};

export const useChatMessage = () => {
	const toast = useToast();

    const onClickCloseToast = useCallback(() => {
        toast.closeAll();
    }, [toast]);

	const showChatMessage = useCallback(
		(props: Props) => {
			const { title, status, log, players } = props;
            const user = players.find((user) => user.name === log.owner)

			toast({
				title,
				status,
				position: "top",
				duration: 2000,
				isClosable: true,
                render: () => (
                    <Box
                        onClick={onClickCloseToast}
                        color='bray'
                        p={2}
                        bg="gray.100"
					    borderRadius="10px"
					    shadow="md">
                      <ChatMessage user={user} log={log}/>
                    </Box>
                  ),
			});
		},
		[toast, onClickCloseToast]
	);
	return { showChatMessage };
};