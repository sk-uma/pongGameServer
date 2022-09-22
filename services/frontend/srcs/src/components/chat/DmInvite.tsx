import { Avatar, AvatarBadge, Box, Flex, Menu, MenuButton, MenuItem, MenuList, Text } from "@chakra-ui/react";
import { memo, VFC } from "react";
import { useLoginPlayer } from "../../hooks/useLoginPlayer";
import { useInviteDm } from "./hooks/Dm";

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
};

export const DmInviteUserCard: VFC<Props> = memo((props) => {
    const { loginName, imgUrl, name, displayName, level, status } = props;


    const logindata = useLoginPlayer();
    let UserName = '';
    if (logindata && logindata.loginPlayer)
        UserName = logindata.loginPlayer.name;
    const { inviteDm } = useInviteDm(UserName);

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


    //const AmIOwner = (room && logindata?.loginPlayer?.name === room.owner);
    //const AmIAdmin = (room && logindata && logindata.loginPlayer && room.admin_list.includes(logindata?.loginPlayer?.name));
    //const IsOwner = (room && name === room.owner);
    //const IsAdmin = (room && room.admin_list.includes(name));

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
						<Text fontSize="sm">Lv {level}</Text>
					</Box>
				</Flex>
                </Box>
            </MenuButton>
            <MenuList>
                <MenuItem>
                    # {name} Profile
                </MenuItem>
                { //AmIOwner && IsAdmin && !IsOwner &&
                
                    <MenuItem onClick={() => inviteDm(name, UserName)}>
                        start a direct message
                    </MenuItem>
                }
 
            </MenuList>
        </Menu>
    );
});