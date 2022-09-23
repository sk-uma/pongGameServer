import { useCallback, useContext } from "react";
import { useMessage } from "../../../hooks/useMessage";
import { ChatContext } from "../provider/ChatProvider";

//import { Player } from "../types/api/Player";
//import { constUrl } from "../constant/constUrl";

//mute


export const useInviteDm = (name: string) => {

    const { socket } = useContext(ChatContext);
    const { showMessage } = useMessage();

	const inviteDm = useCallback((target: string, name: string) => {
        //alert(`${name} mute => ${target}`);
        
        const payload = {
            roomName: `${target} + ${name}`,
            roomType: 'dm',
            password: '',
            invited: target,
            name: name,//target
        }
        socket.emit('Chat/generate/DmRoom', payload);        

        showMessage({
            title: `start a Dm`,
            status: "success",
        });
	}, [socket, showMessage]);

	return { inviteDm };
};