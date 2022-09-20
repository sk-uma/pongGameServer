import { Box, HStack, Image, Link, Stack, Text } from "@chakra-ui/react";
import { memo, useEffect, VFC } from "react";
import { useAllPlayers } from "../../hooks/useAllPlayers";
import { Player } from "../../types/api/Player";
import { ChatUserMenu } from "./organisms/ChatUserMenu";
import { ChatAllDataType, ChatRoomType } from "./type/ChatType";

type Props = {
    chatAllData :ChatAllDataType | undefined;
    currentRoom : ChatRoomType | undefined;
    currentRoomId : string;
}

function PermissionTitle(props: {permission: String}) {
    return (
    <>
        <Box style={{marginTop: '10px'}}>
            <Text as="b" color='gray.600'>
                {props.permission}
            </Text>
        </Box>
    </>
    );
}

function MemberCard(props: {user: Player}) {
    return (
    <>
        <Box width='100%'>
            <HStack>
                <Image
                    src={props.user.imgUrl}
                    style={{
                        borderRadius: '12%',
                        height: '35px',
                        width: '35px',
                        objectFit: 'cover',
                    }}
                />
                <Text as="b">
                    {props.user.displayName}
                </Text>
            </HStack>
            {/* </Image> */}
        </Box>
    </>
    );
}

export const ChatRight: VFC<Props> = memo((props) => {

    const {chatAllData, currentRoom, currentRoomId} = props;
    const { getPlayers, players } = useAllPlayers();

    useEffect(() => {
		getPlayers();
	}, [getPlayers]);


    if (currentRoom && currentRoomId !== 'default' && chatAllData)
    {
    }
    else
        return (<Box></Box>);

    const owner_list = players.filter((item) => item.name === currentRoom.owner);
    const admin_list = players.filter((item) => currentRoom.admin_list.includes(item.name));
    const member_list =  players.filter((item) => currentRoom.member_list.includes(item.name));

    return (
        <Box marginLeft={'10px'}>
            {/* <PermissionTitle> */}
            <PermissionTitle permission={'owner'} />
            <Stack>
            {
                // owner_list && owner_list[0].displayName
                owner_list.map((member, index) => {
                    return (
                        <MemberCard
                            user={member}
                            key={index}
                        />
                    );
                })
            }
            </Stack>
            <PermissionTitle permission={'admin'} />
            {/* <Box>-- admin --</Box> */}
            <Stack>
            {
                admin_list.map((member, index) => {
                    
                    return (
                        <MemberCard
                            user={member}
                            key={index}
                        />
                        // <Box key={index}> {member.displayName} </Box>
                    )
                })
            }
            </Stack>
            <PermissionTitle permission={'member'} />
            {/* <Box>-- member --</Box> */}
            {
                member_list.map((member, index) => {
                    return (
                        <Link key={index}>
                            <ChatUserMenu
                                opponentUser={member}
                                opponentName={member.name}
                                room={currentRoom}
                                />
                        </Link>
                    )
                })
            }
        </Box>
    );
})