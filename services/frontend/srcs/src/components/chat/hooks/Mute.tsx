import { useCallback, useContext } from "react";
//import { useMessage } from "../../../hooks/useMessage";
import { ChatContext } from "../provider/ChatProvider";
import { ChatRoomType } from "../type/ChatType";

//import { Player } from "../types/api/Player";
//import { constUrl } from "../constant/constUrl";

//mute


export const useMutePlayer = (room: ChatRoomType | undefined, name: string) => {

    const { socket } = useContext(ChatContext);
    //const { showMessage } = useMessage();

	const mutePlayer = useCallback((target: string) => {
        //alert(`${name} mute => ${target}`);
        
        if (!room)
            return ;
        const payload = {
            roomId: room.id,
            player: name,//target
            target: target,
        }
        socket.emit('Chat/addMuteUser', payload); 
        //showMessage({
        //    title: `mute`,
        //    status: "success",
        //});
	}, [name, room, socket]);

    const unMutePlayer = useCallback((target: string) => {
        //alert(`${name} mute => ${target}`);
        
        if (!room)
            return ;
        const payload = {
            roomId: room.id,
            player: name,//target
            target: target,
        }
        socket.emit('Chat/unmuteUser', payload); 
        //showMessage({
        //    title: `unmute`,
        //    status: "success",
        //});
	}, [name, room, socket]);

	return { mutePlayer, unMutePlayer };
};