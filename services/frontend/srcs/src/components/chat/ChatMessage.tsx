import { Box, Flex, HStack, Image, Text } from "@chakra-ui/react";
import { memo, VFC } from "react";
import { Player } from "../../types/api/Player";
import { ChatLogType } from "./type/ChatType";

type Props = {
    user?: Player;
    log: ChatLogType;
}

export const ChatMessage: VFC<Props> = memo((props) => {
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
                    whiteSpace: 'pre-wrap',
                    width: '100%',
                    textAlign: 'justify',
                }}>
                    {props.log.text}
                </Text>
            </Box>
        </Flex>
    );
});
