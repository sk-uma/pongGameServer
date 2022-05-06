import Phaser from 'phaser'
import PongScene from './PongScene'

export const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  backgroundColor: 0x222222,
  scale: {
    width: 800,
    height: 600
  },
  physics: {
    default: 'arcade',
    arcade: {
      debug: true,
      fps: 45,
    },
  },
  scene: [PongScene]
}
