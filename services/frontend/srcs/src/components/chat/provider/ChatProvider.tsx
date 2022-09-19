import { createContext } from "react";
import { io, Socket } from "socket.io-client";

interface chatContext {
    socket: Socket,
}

//SOCKET_URLの中身のところに接続を要求
const socket = io("http://localhost:3001");

export const ChatContext = createContext<chatContext>({
    socket, 
});

export const ChatProvider = (props: { children: any; }) => {
    const { children } = props;

    return (
        <ChatContext.Provider
            value={{
                socket,
                }}>
            {children}    
        </ChatContext.Provider>
    )
}