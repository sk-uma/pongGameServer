import { useCallback } from "react";
import { Socket } from "socket.io-client";

export const useUpdateStatus = () => {
	const updateStatus = useCallback((socket: Socket) => {
		//接続が完了したら、発火
		socket.on("connect", () => {
			console.log("接続ID : ", socket.id);
		});

		//切断
		return () => {
			console.log("切断");
			socket.disconnect();
		};
	}, []);
	return { updateStatus };
};
