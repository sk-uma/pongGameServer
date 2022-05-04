import { memo, VFC, useEffect, CSSProperties } from "react";
import { config } from "../game/Pong/PongConfig";
import Phaser from 'phaser';

export const Game: VFC = memo(() => {
	const style: CSSProperties = {
    textAlign: "center"
  }

	useEffect(() => {
		const g = new Phaser.Game(config)
		return () => {
			g?.destroy(true)
		}
	}, []);

	return (
		<div style={style}>
				<a
          className="App-link"
          href="https://github.com/kevinshen56714/create-react-phaser3-app"
          target="_blank"
          rel="noopener noreferrer"
        ></a>
		</div>
	);
});
