import { Box, Button, Flex, HStack, Image, Text } from "@chakra-ui/react";
import axios from "axios";
import { memo, useEffect, useState, VFC } from "react";
import { useNavigate } from "react-router-dom";
import { constUrl } from "../../constant/constUrl";
import { Player } from "../../types/api/Player";
import { ChatLogType } from "./type/ChatType";

type Props = {
    user?: Player;
    log: ChatLogType;
    isOwn: boolean;
}

export const ChartInvaitChatMessage: VFC<Props> = memo((props) => {
    const navigate = useNavigate();
    let [type, privateKey] = props.log.text.split("@");
    const [isAvailable, setIsAvailable] = useState(false);

    const onClick = () => {
        axios
            .get(constUrl.serversideUrl + '/game/ckeckKey', {params: {
                key: privateKey
            }})
            .then(function(response) {
                if (response.data.status === 'found') {
                    navigate('/home/game/play', {state: {
                        mode: 'private',
                        game: type,
                        data: {
                        privateKey: privateKey
                        }
                    }});
                } else {
                    setIsAvailable(false);
                    alert("無効なキーです");
                }
            });
    }

    useEffect(() => {
        axios
            .get(constUrl.serversideUrl + '/game/ckeckKey', {params: {
                key: privateKey
            }})
            .then((response) => {
                console.log(response.data.status, privateKey);
                if (response.data.status === 'found') {
                    setIsAvailable(true);
                } else {
                    // console.log(privateKey);
                    setIsAvailable(false);
                }
            });
    }, []);

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
            <Box>
                <Flex>
                    <HStack>
                        <Text as='b' size='md'>
                            {props.user?.displayName}
                        </Text>
                        <Text as="sub" color='gray' style={{marginBottom: '4px'}}>
                            {props.log.time}
                        </Text>
                    </HStack>
                </Flex>
                <Text>
                    {
                        props.isOwn ?
                            `invited to the ${type}`
                        :
                            `${props.user?.displayName} is inviting you to a ${type}`
                    }<br/>
                </Text>
                <Button
                    size="sm"
                    disabled={!isAvailable}
                    onClick={onClick}
                >
                    Join the Game
                </Button>
            </Box>
        </Flex>
    );
});
