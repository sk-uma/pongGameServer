import { Socket, io } from "socket.io-client";
import React, { useEffect, CSSProperties, useState } from 'react';
import { config } from "./PongConfig";

export let socket: Socket;

export function Pong() {
  console.log('Pong component');

  let [isConnected, setIsConnected] = useState(false);

	const style: CSSProperties = {
    textAlign: "center"
  }

  useEffect(() => {
    let g: Phaser.Game;
    socket = io("http://localhost:3001");

    socket.on('connect', () => {
      console.log('connected....');
    });

    socket.on('disconnect', () => {
      console.log('disconnected...');
    });

    console.log("is connected", isConnected);

    socket.on('opponentIsReadyToStart', () => {
      console.log("ready to start");
      if (!g) {
        g = new Phaser.Game(config);
      }
      setIsConnected(true);
    });

    return () => {
      g?.destroy(true);
      socket.disconnect();
    }
  }, []);

  if (!isConnected) {
    return (
      <div>
        Standby...
      </div>
    )
  } else {
    return (
      <div style={style}>
          <a
            className="App-link"
            href="https://github.com/kevinshen56714/create-react-phaser3-app"
            target="_blank"
            rel="noopener noreferrer"
          > </a>
      </div>
    );
  }
}
