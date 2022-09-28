import { useCallback, useContext } from "react";
//import { useMessage } from "../../../hooks/useMessage";
import { ChatContext } from "../provider/ChatProvider";
import { ChatRoomType } from "../type/ChatType";

//import { Player } from "../types/api/Player";
//import { constUrl } from "../constant/constUrl";

//mute


export const useManageAdminPlayer = (room: ChatRoomType | undefined, name: string) => {

    const { socket } = useContext(ChatContext);
    //const { showMessage } = useMessage();

	const addAdminPlayer = useCallback((target: string) => {
        //alert(`${name} mute => ${target}`);
        
        if (!room)
            return ;
        const payload = {
            roomId: room.id,
            player: name,//target
            newAdmin: target,
        }
        socket.emit('Chat/addAdmin', payload); 
        //showMessage({
        //    title: `add admin`,
        //    status: "success",
        //});
	}, [name, room, socket]);

    const deleteAdminPlayer = useCallback((target: string) => {
        //alert(`${name} mute => ${target}`);
        
        if (!room)
            return ;
        const payload = {
            roomId: room.id,
            player: name,//target
            newAdmin: target,
        }
        socket.emit('Chat/deleteAdmin', payload); 
        //showMessage({
        //    title: `delete admin`,
        //    status: "success",
        //});
	}, [name, room, socket]);

	return { addAdminPlayer, deleteAdminPlayer };
};