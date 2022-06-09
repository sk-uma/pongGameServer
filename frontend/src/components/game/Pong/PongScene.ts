import Phaser from 'phaser';
import io, {} from 'socket.io-client';
import { useEffect } from 'react';
import { gameInfo } from './Pong';
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
  private gameInfo: any;
  private date?: Date;

  constructor() {
    super({
      key: 'Main'
    })
    

    // Socket
    // this.socket = io("http://localhost:3001");
    this.gameInfo = gameInfo;

    // console.log("Pong constructor", socket);

    console.log(gameInfo);
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

    this.player1 = this.playerGroup.create(this.gameInfo.isServer ? 50 : 750, 300, "player");
    this.player2 = this.playerGroup.create(this.gameInfo.isServer ? 750 : 50, 300, "player");

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
    this.gameInfo.socket.emit('initGameData', initGameData);

    // this.socket.on('connect', () => {
    //   console.log('connected!!!');
    // })

    // this.socket.on('disconnect', () => {
    //   console.log('disconnected!!!');
    // })

    // this.socket.on('UpdateCheckedGameData', (data: any) => {
    //   // console.log(data);
    // });

    this.gameInfo.socket.on('UpdateCheckedGameData', (data: any) => {
      // console.log(data);
      if (!this.gameInfo.isServer) {
        this.ball?.setVelocity(data.ball.velocity.x, data.ball.velocity.y);
        this.ball?.setPosition(data.ball.position.x, data.ball.position.y);
      }
      this.player2?.setVelocityY(data.player.velocity.y);
      this.player2?.setPosition(this.gameInfo.isServer ? 750 : 50, data.player.position.y);
    });

    this.gameInfo.socket.on('PlayerLeaveRoom', (data: any) => {
      // console.log('leaved');
      this.ball?.setVelocity(0, 0);
      this.ball?.setPosition(400, 300);
    });

    this.gameInfo.socket.on('restartGame', (data: any) => {
      if (this.gameInfo.isServer) {
        let ballYSpeed: number = Phaser.Math.Between(-300, 300);
        this.ball?.setVelocity(this.ballXSpeed, ballYSpeed);
        this.ball?.setPosition(400, 300);
      }
    });
  }

  sendGameData(): void {
    // console.log({
    //   y: this.player1?.x
    // })
    // console.log(this?.gameInfo.room_id);
    if (this.gameInfo.isServer) {
      this.gameInfo.socket.emit('updateGameData', {
        room_id: this?.gameInfo.roomID,
        ball: {
          velocity: {
            x: this.ball?.body.velocity.x,
            y: this.ball?.body.velocity.y,
          },
          position: {
            x: this.ball?.x,
            y: this.ball?.y,
          }
        },
        player: {
          velocity: {
            y: this.player1?.body.velocity.y,
          },
          position: {
            y: this.player1?.y,
          }
        }
      });
    } else {
      this.gameInfo.socket.emit('updateGameData', {
        room_id: this?.gameInfo.roomID,
        player: {
          velocity: {
            y: this.player1?.body.velocity.y,
          },
          position: {
            y: this.player1?.y,
          }
        }
      });
    }
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
    // console.log("Phaser update");
  }

  setSocket(): void {

  }
}
