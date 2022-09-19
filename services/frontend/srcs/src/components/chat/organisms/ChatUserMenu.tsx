import { Box, Link, Menu, MenuButton, MenuItem, MenuList } from "@chakra-ui/react";
import axios from "axios";
import { memo, VFC } from "react";
import { useNavigate } from "react-router-dom";
import { constUrl } from "../../../constant/constUrl";
import { useGetPlayerwithToken } from "../../../hooks/useGetPlayerWithToken";
import { useLoginPlayer } from "../../../hooks/useLoginPlayer";
import { useMessage } from "../../../hooks/useMessage";
import { Player } from "../../../types/api/Player";
import { ChatRoomType } from "../type/ChatType";


type Props = {
    //setCurrentRoomId : (roomid: string) => void;
    //setCurrentRoom : (room: ChatRoomType) => void;
    room: ChatRoomType;
    opponentName: string;
    opponentUser: Player;
}

export const ChatUserMenu: VFC<Props> = memo((props) => {
    const { opponentName, opponentUser, room
           } = props;

    //const { socket } = useContext(ChatContext);
    
    const navigate = useNavigate();

    const logindata = useLoginPlayer();
    const { showMessage } = useMessage();
    const { getPlayerWithToken } = useGetPlayerwithToken();

    let userName = logindata.loginPlayer?.name;
    if (!userName)
        userName = 'default';

    const onClickRoomLink = (room: void) => {
        //setCurrentRoomId(room.id);
        //setCurrentRoom(room);
    }

    const onCLickInviteGame = (name: string) => {
        //setCurrentRoomId(room.id);
        //setCurrentRoom(room);
        alert('Sent an invitation');
    }

    //const onClickDeleteRoom = async () => {

        /*if (!logindata || !logindata.loginPlayer)
            return ;
        const payload = {
            roomId: room.id,
            name: room.owner,
        }
        console.log(payload)
        await socket.emit('Chat/delete/room', payload);  */      
    //};

	const onClickUnFriend = () => {
		axios
			.delete(
				constUrl.serversideUrl +
					`/players/deletefriend/${logindata?.loginPlayer?.name}/${opponentName}`
			)
			.then(() => {
				getPlayerWithToken();
				showMessage({
					title: `${opponentName}, Unfriend Successful`,
					status: "success",
				});
			});
	};

    const onClickBlock = () => {
		axios
			.patch(
				constUrl.serversideUrl +
					`/players/block/${logindata?.loginPlayer?.name}/${opponentName}`
			)
			.then(() => {
				if (logindata?.loginPlayer?.friends.includes(opponentName)) {
					onClickUnFriend();
				} else {
					getPlayerWithToken();
				}
				showMessage({
					title: `${opponentName}, Block Successful`,
					status: "success",
				});
			});
	};

    const onClickUnBlock = () => {
		axios
			.delete(
				constUrl.serversideUrl +
					`/players/unblock/${logindata?.loginPlayer?.name}/${opponentName}`
			)
			.then(() => {
				getPlayerWithToken();
				showMessage({
					title: `${opponentName}, Unblock Successful`,
					status: "success",
				});
			});
	};

    const isBlocked = logindata?.loginPlayer?.blockList.includes(opponentName);
    let role = 'member';
    if (room.admin_list.includes(opponentName))
        role = 'admin';
    if (room.owner === opponentName)
        role = 'owner';

    return (
        <Box>
            <Menu>
                <MenuButton>
                    <Link
                        onClick={() => onClickRoomLink()}
                        >{opponentUser.displayName}       
                    </Link>
                </MenuButton>
                <MenuList>
                    <Box>
                    # {opponentUser.displayName} {role}
                    </Box>
                    <MenuItem >Profile</MenuItem>
                    {
                        userName !== opponentName && 
                        <MenuItem onClick={() => onCLickInviteGame(opponentName)}>Invite game1</MenuItem>
                    }
                    {
                        userName !== opponentName && 
                        <MenuItem onClick={() => navigate('/home/game/private')}>Invite game2</MenuItem>
                    }
                    {
                        !isBlocked && userName !== opponentName && <MenuItem onClick={onClickBlock}>Block</MenuItem>  
                    }
                    {
                        isBlocked && userName !== opponentName && <MenuItem onClick={onClickUnBlock}>UnBlock</MenuItem> 
                    }
                </MenuList>
            </Menu> 
        </Box>
    );
});