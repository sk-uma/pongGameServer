import { Avatar, AvatarBadge, Box, Flex, Menu, MenuButton, MenuItem, MenuList, Text } from "@chakra-ui/react";
import { memo, VFC } from "react";
import { useLoginPlayer } from "../../../hooks/useLoginPlayer";
import { ChatRoomType } from "../type/ChatType";
import { useMutePlayer } from "../hooks/Mute";
import { ChatBlockUser } from "../hooks/Block";
import { useBanPlayer } from "../hooks/Ban";
import { useKickPlayer } from "../hooks/Kick";
import { useManageAdminPlayer } from "../hooks/ManageAdmin";

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

export const ChatUserCard: VFC<Props> = memo((props) => {
    const { loginName, imgUrl, name, displayName, level, status, room} = props;


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

    const AmIOwner = (room && logindata?.loginPlayer?.name === room.owner);
    const AmIAdmin = (room && logindata && logindata.loginPlayer && room.admin_list.includes(logindata?.loginPlayer?.name));
    const IsOwner = (room && name === room.owner);
    const IsAdmin = (room && room.admin_list.includes(name));

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
						<Text fontSize="sm">Lv {level}    {position}</Text>
					</Box>
				</Flex>
                </Box>
            </MenuButton>
            <MenuList>
                <MenuItem>
                    # {name} Profile
                </MenuItem>
                { AmIAdmin && !IsOwner &&
                <MenuItem onClick={() => banPlayer(name)}>
                    Ban
                </MenuItem>
                }
                { logindata && logindata.loginPlayer &&
                    name !== logindata.loginPlayer?.name &&
                    <ChatBlockUser opponentName={name}/>
                }
                { AmIAdmin && !IsOwner && !room.mute_list.includes(name) &&
                <MenuItem onClick={() => mutePlayer(name)}>
                    Mute
                </MenuItem>
                }
                { AmIAdmin && !IsOwner && room.mute_list.includes(name) &&
                <MenuItem onClick={() => unMutePlayer(name)}>
                    UnMute
                </MenuItem>
                }
                { AmIAdmin && !IsOwner &&
                <MenuItem onClick={() => kickPlayer(name)}>
                    Kick
                </MenuItem>
                }
                { AmIOwner && !IsAdmin && !IsOwner &&
                <MenuItem onClick={() => addAdminPlayer(name)}>
                    Add admin
                </MenuItem>
                }
                { AmIOwner && IsAdmin && !IsOwner &&
                <MenuItem onClick={() => deleteAdminPlayer(name)}>
                    delete admin
                </MenuItem>
                }
 
            </MenuList>
        </Menu>
    );
});