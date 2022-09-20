import { Box, MenuItem } from "@chakra-ui/react";
import axios from "axios";
import { memo, VFC } from "react";
import { constUrl } from "../../../constant/constUrl";
import { useGetPlayerwithToken } from "../../../hooks/useGetPlayerWithToken";
import { useLoginPlayer } from "../../../hooks/useLoginPlayer";
import { useMessage } from "../../../hooks/useMessage";


type Props = {
    opponentName: string;
}

export const ChatBlockUser: VFC<Props> = memo((props) => {
    const { opponentName
           } = props;

    //const { socket } = useContext(ChatContext);
    
    const logindata = useLoginPlayer();
    const { showMessage } = useMessage();
    const { getPlayerWithToken } = useGetPlayerwithToken();

    let userName = logindata.loginPlayer?.name;
    if (!userName)
        userName = 'default';

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

    return (
        <Box>
            {
                !isBlocked && userName !== opponentName && <MenuItem onClick={onClickBlock}>Block</MenuItem>  
            }
            {
                isBlocked && userName !== opponentName && <MenuItem onClick={onClickUnBlock}>UnBlock</MenuItem> 
            }
        </Box>
    );
});