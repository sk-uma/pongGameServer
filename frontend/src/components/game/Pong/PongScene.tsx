import Phaser from 'phaser';
import io, {} from 'socket.io-client';
import { useEffect } from 'react';
import { socket } from './Pong';
// import player from './assets/player.png'

interface InitGameData {
  playerName: string;
  ball: {
    velocity: {
      x: number;
      y: number;
    };
  };
  time: any
}

interface UpdateGameData {
  playerName: string;
  ball: {
    velocity: {
      x: number | undefined;
      y: number | undefined;
    };
    position: {
      x: number | undefined;
      y: number | undefined;
    }
  };
  player: {
    velocity: {
      x?: number | undefined;
      y: number | undefined;
    };
    position: {
      x?: number | undefined;
      y: number | undefined;
    }
  }
  time: any
}

export default class PongScene extends Phaser.Scene {
  private playerGroup?: Phaser.Physics.Arcade.Group;
  private player1?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private player2?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private ball?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private ballXSpeed: number = 400;
  private socket: any;
  private date?: Date;

  constructor() {
    super({
      key: 'Main'
    })
    

    // Socket
    // this.socket = io("http://localhost:3001");
    this.socket = socket;

    console.log("Pong constructor", socket);

    this.socket.on('UpdateCheckedGameData', (data: any) => {
      // console.log(data);
    });
  }

  // init(): void { }

  preload(): void {
    this.load.image('player', `${window.location.origin}/assets/player.png`)
    this.load.image('ball', `${window.location.origin}/assets/ball.png`)
  }

  /**
   * Phaser初期実行時の関数
   * オブジェクトの生成、ソケットの初期化等を行う
   */
  create(): void {
    // Phaser
    this.playerGroup = this.physics.add.group();

    this.player1 = this.playerGroup.create(50, 300, "player");
    this.player2 = this.playerGroup.create(750, 300, "player")
    this.player1?.setCollideWorldBounds(true);
    this.player2?.setCollideWorldBounds(true);
    this.player1?.setImmovable(true);
    this.player2?.setImmovable(true);

    this.ball = this.physics.add.sprite(400, 300, "ball").setScale(0.1);

    let ballYSpeed: number = Phaser.Math.Between(-300, 300);
    this.ball.setVelocity(this.ballXSpeed, ballYSpeed);
    this.ball.setCollideWorldBounds(true);
    this.ball.setBounce(1);

    this.physics.add.collider(this.ball, this.playerGroup, (b, p) => {
      // TODO
    }, undefined, this);

    // this.ball.body.position.x

    // Socket
    // this.socket = io("http://localhost:3001");

    let time = Date.now()
    let initGameData: InitGameData = {
      playerName: "player1",
      ball: {
        velocity: {
          x: this.ballXSpeed,
          y: ballYSpeed
        }
      },
      time: Date.now()
    }
    this.socket.emit('initGameData', initGameData);

    // this.socket.on('connect', () => {
    //   console.log('connected!!!');
    // })

    // this.socket.on('disconnect', () => {
    //   console.log('disconnected!!!');
    // })

    // this.socket.on('UpdateCheckedGameData', (data: any) => {
    //   // console.log(data);
    // });
  }

  sendGameData(): void {
    let updateGameData: UpdateGameData = {
      playerName: "player1",
      ball: {
        velocity: {
          x: this.ball?.body.velocity.x,
          y: this.ball?.body.velocity.y,
        },
        position: {
          x: this.ball?.body.position.x,
          y: this.ball?.body.position.y,
        }
      },
      player: {
        velocity: {
          y: this.player1?.body.position.y
        },
        position: {
          y: this.player1?.body.position.y
        }
      },
      time: Date.now()
    };
    this.socket.emit('updateGameData', 'Hello');
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

    this.sendGameData();
    console.log("Phaser update");
  }

  setSocket(): void {

  }
}
