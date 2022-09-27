import Phaser from 'phaser'
import Pong from './Pong'

export const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  backgroundColor: 0x000000,
  pixelArt: true,
  scale: {
    width: 900,
    height: 800,
    parent: 'phaser-example',
    autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
  },
  physics: {
    default: 'arcade',
    arcade: {
      // debug: true,
      fps: 60,
    },
  },
  scene: [Pong]
}
