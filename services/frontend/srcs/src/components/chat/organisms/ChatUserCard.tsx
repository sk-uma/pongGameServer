import { Avatar, AvatarBadge, Box, Flex, Menu, MenuButton, MenuItem, MenuList, Text } from "@chakra-ui/react";
import { memo, VFC } from "react";
import { useLoginPlayer } from "../../../hooks/useLoginPlayer";
import { ChatRoomType } from "../type/ChatType";
import { useMutePlayer } from "../hooks/Mute";
import { ChatBlockUser } from "../hooks/Block";
import { useBanPlayer } from "../hooks/Ban";
import { useKickPlayer } from "../hooks/Kick";
import { useManageAdminPlayer } from "../hooks/ManageAdmin";
import { CheckPermission } from "../hooks/Permission";

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
    win:number;
    lose:number;
    exp: number;
    room: ChatRoomType | undefined;
};

export const ChatUserCard: VFC<Props> = memo((props) => {
    const { loginName, imgUrl, name, displayName, level, status, room, win, lose, exp} = props;


    const logindata = useLoginPlayer();
    let UserName = '';
    if (logindata && logindata.loginPlayer)
        UserName = logindata.loginPlayer.name;
    const { mutePlayer, unMutePlayer } = useMutePlayer(room, UserName);
    const { banPlayer } = useBanPlayer(room, UserName);
    const { kickPlayer } = useKickPlayer(room, UserName);
    const { addAdminPlayer, deleteAdminPlayer } = useManageAdminPlayer(room, UserName);

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
                            room && room.mute_list.includes(name) && 
                            <Text fontWeight="bold" color='red' style={{marginRight: '6px'}}>muted</Text>
                        }
						<Text fontWeight="bold" style={{marginRight: '12px'}}>{displayName}</Text>
                        {
                             room?.roomType !== 'dm' && 
						    <Text fontWeight="sm" color='gray'>{position}</Text>
                        }
                        </Flex>
                        <Flex display='flex' justifyContent='center'>
						<Text fontSize="sm" color='gray'>Lv {level} Win: {win} Lose: {lose} Exp: {exp}</Text>
                        </Flex>
					</Box>
				</Flex>
                </Box>
            </MenuButton>
            <MenuList>
                <Text as='b'># {name}</Text>
                
                { room?.roomType !== 'dm' && CheckPermission(room, logindata.loginPlayer, name, 'ban') &&
                <MenuItem onClick={() => banPlayer(name)}>
                    Ban
                </MenuItem>
                }
                { logindata && logindata.loginPlayer &&
                    name !== logindata.loginPlayer?.name &&
                    <ChatBlockUser opponentName={name}/>
                }
                { room?.roomType !== 'dm' &&  CheckPermission(room, logindata.loginPlayer, name, 'mute') &&
                <MenuItem onClick={() => mutePlayer(name)}>
                    Mute
                </MenuItem>
                }
                { room?.roomType !== 'dm' &&  CheckPermission(room, logindata.loginPlayer, name, 'unmute') &&
                <MenuItem onClick={() => unMutePlayer(name)}>
                    UnMute
                </MenuItem>
                }
                { room?.roomType !== 'dm' &&  CheckPermission(room, logindata.loginPlayer, name, 'kick') &&
                <MenuItem onClick={() => kickPlayer(name)}>
                    Kick
                </MenuItem>
                }
                { room?.roomType !== 'dm' &&  CheckPermission(room, logindata.loginPlayer, name, 'addAdmin') &&
                <MenuItem onClick={() => addAdminPlayer(name)}>
                    Add admin
                </MenuItem>
                }
                { room?.roomType !== 'dm' &&  CheckPermission(room, logindata.loginPlayer, name, 'deleteAdmin') &&
                <MenuItem onClick={() => deleteAdminPlayer(name)}>
                    delete admin
                </MenuItem>
                }
 
            </MenuList>
        </Menu>
    );
});