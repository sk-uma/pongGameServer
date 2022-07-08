import Phaser from 'phaser'
import PongClassic from './PongClassic'
import PongScene from './PongScene'

export const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  // parent: 'phaser-example',
  backgroundColor: 0x000000,
  pixelArt: true,
  scale: {
    width: 900,
    height: 800,
    parent: 'phaser-example',
    autoCenter: Phaser.Scale.CENTER_HORIZONTALLY,
    // mode: Phaser.Scale.FIT
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
      fps: 60,
    },
  },
  scene: [PongClassic]
  // scene: [PongScene]
}
