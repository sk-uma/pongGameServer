import { useCallback, useContext } from "react";
import { useMessage } from "../../../hooks/useMessage";
import { ChatContext } from "../provider/ChatProvider";
import { ChatRoomType } from "../type/ChatType";

//import { Player } from "../types/api/Player";
//import { constUrl } from "../constant/constUrl";

//mute


export const useInvitePlayer = (room: ChatRoomType | undefined, name: string) => {

    const { socket } = useContext(ChatContext);
    const { showMessage } = useMessage();

	const invitePlayer = useCallback((target: string) => {
        //alert(`${name} mute => ${target}`);
        
        if (!room)
            return ;
        const payload = {
            roomId: room.id,
            name: target,
        }
        socket.emit('Chat/send/joinRoom', payload); 
        showMessage({
            title: `add user`,
            status: "success",
        });
	}, [room, socket, showMessage]);

	return { invitePlayer };
};