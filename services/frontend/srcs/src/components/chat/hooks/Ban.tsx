import { useCallback, useContext } from "react";
//import { useMessage } from "../../../hooks/useMessage";
import { ChatContext } from "../provider/ChatProvider";
import { ChatRoomType } from "../type/ChatType";

//import { Player } from "../types/api/Player";
//import { constUrl } from "../constant/constUrl";

//mute


export const useBanPlayer = (room: ChatRoomType | undefined, name: string) => {

    const { socket } = useContext(ChatContext);
    //const { showMessage } = useMessage();

	const banPlayer = useCallback((target: string) => {
        //alert(`${name} mute => ${target}`);
        
        if (!room)
            return ;
        const payload = {
            roomId: room.id,
            player: name,//target
            target: target,
        }
        socket.emit('Chat/addBanUser', payload); 
        const payload2 = {
            roomId: room.id,
            target: target,
            name: name,
        }
        socket.emit('Chat/delete/roomMember', payload2); 
        //showMessage({
        //    title: `ban`,
        //    status: "success",
        //});
	}, [name, room, socket]);

    const unBanPlayer = useCallback((target: string) => {
        //alert(`${name} mute => ${target}`);
        
        if (!room)
            return ;
        const payload = {
            roomId: room.id,
            player: name,//target
            target: target,
        }
        socket.emit('Chat/UnbanUser', payload); 
        //showMessage({
        //    title: `unban`,
        //    status: "success",
        //});
	}, [name, room, socket]);

	return { banPlayer, unBanPlayer };
};