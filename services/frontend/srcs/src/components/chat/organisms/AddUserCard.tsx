import { Avatar, AvatarBadge, Box, Flex, Menu, MenuButton, MenuItem, MenuList, Text } from "@chakra-ui/react";
import { memo, VFC } from "react";
import { useLoginPlayer } from "../../../hooks/useLoginPlayer";
import { ChatRoomType } from "../type/ChatType";
import { useInvitePlayer } from "../hooks/Invite";
import { useBanPlayer } from "../hooks/Ban";

//type Props = {
//    memberName: string,
//};

type Props = {
	loginName: string;
	imgUrl: string;
	name: string;
	displayName: string;
	level: number;
	//isfriend: boolean;
	status: string;
    win: number;
    lose: number;
    exp: number;
    room: ChatRoomType | undefined;
};

export const AddUserCard: VFC<Props> = memo((props) => {
    const { loginName, imgUrl, name, displayName, level, status, room, win, lose, exp} = props;


    const logindata = useLoginPlayer();
    let UserName = '';
    if (logindata && logindata.loginPlayer)
        UserName = logindata.loginPlayer.name;
    const { invitePlayer } = useInvitePlayer(room, UserName);
    const { unBanPlayer } = useBanPlayer(room, UserName);

    const statusColor = () => {
		switch (status) {
			case "LOGIN":
				return "green.500";
			case "PLAY":
				return "yellow.300";
			default:
				return "gray.300";
		}
	};

    let position = '';
    if (room)
    {
        position = '';
        if (room.admin_list.includes(name))
            position = 'admin';
        if (room.owner === name)
            position = 'owner';
    }

    return (
        <Menu>
            <MenuButton>
                <Box>
                <Flex px={3}>
					<Avatar src={imgUrl}>
						<AvatarBadge boxSize="1.25em" bg={statusColor()} />
					</Avatar>
					<Box
						ml="2"
						width="300px"
						bgColor="gray.200"
						borderRadius="5px"
					>
                        <Flex display='flex' justifyContent='center'>
                        {
                            room && room.ban_list.includes(name) && 
                            <Text fontWeight="bold" color='red' style={{marginRight: '6px'}}>banned</Text>
                        }
						<Text fontWeight="bold" style={{marginRight: '6px'}}>{displayName}</Text>
						<Text fontWeight="sm">{position}</Text>

                        </Flex>
                        
                        <Flex display='flex' justifyContent='center'>
						<Text fontSize="sm" color='gray'>Lv {level} Win: {win} Lose: {lose} Exp: {exp}</Text>
                        </Flex>
					</Box>
				</Flex>
                </Box>
            </MenuButton>
            <MenuList>
                <Text as='b'># {displayName}</Text>
                { room && !room.ban_list.includes(name) &&
                <MenuItem onClick={() => invitePlayer(name)}>
                    Add
                </MenuItem>
                }
                { room && room.ban_list.includes(name) &&
                  logindata?.loginPlayer?.name === room.owner &&
                    <MenuItem  onClick={() => unBanPlayer(name)}>
                       unban
                   </MenuItem> 
                }
            </MenuList>
        </Menu>
    );
});