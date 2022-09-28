import { useCallback, useContext } from "react";
//import { useMessage } from "../../../hooks/useMessage";
import { ChatContext } from "../provider/ChatProvider";
import { ChatRoomType } from "../type/ChatType";

//import { Player } from "../types/api/Player";
//import { constUrl } from "../constant/constUrl";

//mute


export const useKickPlayer = (room: ChatRoomType | undefined, name: string) => {

    const { socket } = useContext(ChatContext);
    //const { showMessage } = useMessage();

	const kickPlayer = useCallback((target: string) => {
        //alert(`${name} mute => ${target}`);
        
        if (!room)
            return ;
        const payload = {
            roomId: room.id,
            name: name,//target
            target: target,
        }
        socket.emit('Chat/delete/roomMember', payload); 
        //showMessage({
        //    title: `kick`,
        //    status: "success",
        //});
	}, [name, room, socket]);

	return { kickPlayer };
};