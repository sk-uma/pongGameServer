import { useCallback, useContext } from "react";
import { useMessage } from "../../../hooks/useMessage";
import { ChatContext } from "../provider/ChatProvider";
import { ChatRoomType } from "../type/ChatType";

//import { Player } from "../types/api/Player";
//import { constUrl } from "../constant/constUrl";

//mute


export const useJoinRoom = (room: ChatRoomType | undefined, name: string) => {

    const { socket } = useContext(ChatContext);
    const { showMessage } = useMessage();

	const joinRoom = useCallback((target: string) => {
        //alert(`${name} mute => ${target}`);
        
        if (!room)
            return ;
        const payload = {
            roomId: room.id,
            name: target,
        }
        socket.emit('Chat/send/joinRoom', payload); 
        showMessage({
            title: `join room`,
            status: "success",
        });
	}, [room, socket, showMessage]);


	const leaveRoom = useCallback((target: string) => {
        //alert(`${name} mute => ${target}`);
        
        if (!room)
            return ;
        const payload = {
            roomId: room.id,
            name: target,
        }
        socket.emit('Chat/send/leaveRoom', payload); 
        showMessage({
            title: `leave room`,
            status: "success",
        });
	}, [room, socket, showMessage]);

	return { joinRoom, leaveRoom };
};