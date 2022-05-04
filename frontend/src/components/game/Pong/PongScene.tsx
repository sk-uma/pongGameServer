import Phaser from 'phaser'
// import player from './assets/player.png'

export default class PongScene extends Phaser.Scene {
  private playerGroup?: Phaser.Physics.Arcade.Group;
  private player1?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private player2?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private ball?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private ballXSpeed: number = 400;

  constructor() {
    super({
      key: 'Main'
    })
  }

  init(): void {

  }

  preload(): void {
    this.load.image('player', `${window.location.origin}/assets/player.png`)
    this.load.image('ball', `${window.location.origin}/assets/ball.png`)
  }

  create(): void {
    this.playerGroup = this.physics.add.group();

    this.player1 = this.playerGroup.create(50, 300, "player");
    this.player2 = this.playerGroup.create(750, 300, "player")
    this.player1?.setCollideWorldBounds(true);
    this.player2?.setCollideWorldBounds(true);
    this.player1?.setImmovable(true);
    this.player2?.setImmovable(true);

    this.ball = this.physics.add.sprite(400, 300, "ball").setScale(0.1);

    this.ball.setVelocity(this.ballXSpeed, Phaser.Math.Between(-300, 300));
    this.ball.setCollideWorldBounds(true);
    this.ball.setBounce(1);

    this.physics.add.collider(this.ball, this.playerGroup, (b, p) => {
      // this.ball?.setVelocity(b.body.velocity.x * -1, b.body.velocity.y);
    }, undefined, this);
  }

  update(): void {
    let cursors = this.input.keyboard.createCursorKeys();

    if (cursors.up.isDown) {
      this.player1?.setVelocityY(-300);
    } else if (cursors.down.isDown) {
      this.player1?.setVelocityY(300);
    } else {
      this.player1?.setVelocityY(0);
    }
  }
}
