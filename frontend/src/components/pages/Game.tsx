import { memo, VFC, useEffect, CSSProperties } from "react";
import { config } from "../game/Pong/PongConfig";
import Phaser from 'phaser';
import { useAllPlayers } from "../../hooks/useAllPlayers";
import { io } from "socket.io-client";
import { Pong } from "../game/Pong/Pong";

export const Game: VFC = memo(() => {

	// useEffect(() => {
	// 	let socket = io("http://localhost:3001");
	// 	socket.on('connect', () => {
	// 		console.log('connected!!!!');
	// 	});
	// 	socket.on('disconnect', () => {
	// 		console.log('disconnect...');
	// 	});
	// 	return () => {
	// 		console.log("use Effect return");
	// 		socket.disconnect();
	// 	};
	// }, []);

	return (
		<Pong />
	);
});
