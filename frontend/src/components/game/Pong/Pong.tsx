import { Socket, io } from "socket.io-client";
import React, { useEffect, CSSProperties } from 'react';
import { config } from "./PongConfig";

export let socket: Socket;

export function Pong() {
	const style: CSSProperties = {
    textAlign: "center"
  }

  useEffect(() => {
    socket = io("http://localhost:3001");
		const g = new Phaser.Game(config);

    socket.on('connect', () => {
      console.log('connected!!!!');
    })

    socket.on('disconnect', () => {
      console.log('disconnected...');
    })

    console.log("useEffect!");

    return () => {
			g?.destroy(true);
      socket.disconnect();
    }
  });

  return (
		<div style={style}>
				<a
          className="App-link"
          href="https://github.com/kevinshen56714/create-react-phaser3-app"
          target="_blank"
          rel="noopener noreferrer"
        > </a>
		</div>
  )
}
