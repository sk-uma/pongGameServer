import Phaser from 'phaser'
import PongClassic from './PongClassic'
import PongScene from './PongScene'

export const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  backgroundColor: 0x000000,
  pixelArt: true,
  scale: {
    width: 900,
    height: 800
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
