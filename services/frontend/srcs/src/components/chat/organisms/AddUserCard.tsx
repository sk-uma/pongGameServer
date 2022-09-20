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
    room: ChatRoomType | undefined;
};

export const AddUserCard: VFC<Props> = memo((props) => {
    const { loginName, imgUrl, name, displayName, level, status, room} = props;


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
						<Text fontWeight="bold">{displayName}</Text>
						<Text fontSize="sm">Lv {level}    {position}
                        {
                            room && room.ban_list.includes(name) && '"banned"'
                        }
                        </Text>
					</Box>
				</Flex>
                </Box>
            </MenuButton>
            <MenuList>
                <MenuItem>
                    # {name} Profile
                </MenuItem>
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