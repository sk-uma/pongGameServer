import Phaser from 'phaser';
import io, { Socket } from 'socket.io-client';
import { useEffect } from 'react';
import { gameInfo } from './Pong';
import { endianness } from 'os';
import axios from 'axios';
import { constUrl } from '../../../constant/constUrl';
// import player from './assets/player.png';

type GameStatus = 'waiting' | 'standBy' | 'playing' | 'leaved' | 'end'

type StringDisplay = {
  leavedMessageDisplay: any;
  standByCountDownDisplay: any;
  score: {
    hostPlayerScoreDisplay: any;
    clientPlayerScoreDisplay: any;
  }
}

/**
 * gameStatus
 *    waiting: 対戦相手を待っている状態
 *    standBy: ゲーム開始前の待機時間(s=5)
 *    playing: 対戦中
 *    leaved : どちらかのプレイヤーが離脱した
 *    end    : ゲームが終了
 * 
 * gameStatus life cycle: 
 * +----+------------+---------+--------------+
 * | t  | HostPlayer |  Status | ClientPlayer |
 * +----+------------+---------+--------------+
 * | 0  | CreateRoom | waiting |              |
 * +----+------------+---------+--------------+
 * | 1  |            | standBy |   JoinRoom   |
 * +----+------------+---------+--------------+
 * | :  |            |    :    |              |
 * +----+------------+---------+--------------+
 * | 6  |            | Playing |              |
 * +----+------------+---------+--------------+
 * | 7  |  LeaveRoom |  leaved |              |
 * +----+------------+---------+--------------+
 * | 8  |  JoinRoom  | standBy |              |
 * +----+------------+---------+--------------+
 * |    |            |    :    |              |
 * +----+------------+---------+--------------+
 * | 13 |            | Playing |              |
 * +----+------------+---------+--------------+
 * |    |            |    :    |              |
 * +----+------------+---------+--------------+
 * |    |            |   end   |              |
 * +----+------------+---------+--------------+
 */
export default class PongScene extends Phaser.Scene {
  private playerGroup?: Phaser.Physics.Arcade.Group;
  private player1?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private player2?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private ball?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private ballXSpeed: number = 400;
  private gameInfo: any;
  private startTime: number = -1;
  private stringDisplay: any;
  // private waitingFrag: boolean = false;
  // private alreadyStartedWaitingFrag: boolean = false;
  // private hostPlayerScore: number = 0;
  // private clientPlayerScore: number = 0;
  private gameStatus: GameStatus = 'standBy';
  private display?: StringDisplay;

  private readonly standByTime: number = 1500;
  // private readonly leavedMessage: string = '対戦相手が離脱しました\nしばらくお待ちください';
  // private readonly standByMessage: string = `ゲーム開始まで1秒`

  constructor() {
    super({
      key: 'Main'
    })

    this.gameInfo = gameInfo;
    // this.gameInfo.gameData.score.hostPlayerScore;
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
    this.playerGroup = this.physics.add.group();

    this.player1 = this.playerGroup.create(this.gameInfo.isServer ? 50 : 750, 300, "player");
    this.player1?.setCollideWorldBounds(true);
    this.player1?.setImmovable(true);

    this.player2 = this.playerGroup.create(this.gameInfo.isServer ? 750 : 50, 300, "player");
    this.player2?.setCollideWorldBounds(true);
    this.player2?.setImmovable(true);

    this.ball = this.physics.add.sprite(400, 300, "ball").setScale(0.1);

    this.ball.setVelocity(0, 0);
    this.ball.setCollideWorldBounds(true);
    this.ball.setBounce(1);

    this.physics.add.collider(this.ball, this.playerGroup, (b, p) => {
      // TODO
    }, undefined, this);

    this.setSocketEvent();

    // this.startTime = Date.now() + this.standByTime;
    this.stringDisplay = this.add.text(400, 100, "");
    this.display = {
      leavedMessageDisplay: this.add.text(400, 250, "").setFontSize(30).setOrigin(0.5),
      standByCountDownDisplay: this.add.text(400, 100, "").setFontSize(30).setOrigin(0.5),
      score: {
        hostPlayerScoreDisplay: this.add.text(250, 50, "").setFontSize(30).setOrigin(0.5),
        clientPlayerScoreDisplay: this.add.text(550, 50, "").setFontSize(30).setOrigin(0.5),
      }
    }
    this.reloadDisplayScore();

    this.startStandBy();
  }

  /**
   * Socketイベントの設定
   * 
   * Socket Event:
   *    UpdateCheckedGameData
   *        互いのプレイヤーの位置を受信し位置を同期する
   *    PlayerLeaveRoom
   *        対戦相手が離脱したことを受信する
   *    restartGame
   *        対戦相手が復帰したことを受信する
   *    updateEventGameData (クライアント限定)
   *        各種ゲーム内のイベント(下記参照)を受信する
   * 
   * Game Event:
   *    startedStandBy
   *        ゲームの開始前の待機時間
   *    getPoint
   *        得点を獲得
   */
  setSocketEvent(): void {
    this.gameInfo.socket.on('hello', (data: any) => {
      console.log(data);
    })

    this.gameInfo.socket.on('UpdateCheckedGameData', (data: any) => {
      if (!this.gameInfo.isServer) {
        this.ball?.setVelocity(data.ball.velocity.x, data.ball.velocity.y);
        this.ball?.setPosition(data.ball.position.x, data.ball.position.y);
      }
      this.player2?.setVelocityY(data.player.velocity.y);
      this.player2?.setPosition(this.gameInfo.isServer ? 750 : 50, data.player.position.y);
    });

    this.gameInfo.socket.on('PlayerLeaveRoom', (data: any) => {
      console.log('PlayerLeaveRoom', data);
      this.ball?.setVelocity(0, 0);
      this.ball?.setPosition(400, 300);
      this.gameStatus = 'leaved';
      // this.stringDisplay.text = "対戦相手が離脱しました。";
      this.display!.leavedMessageDisplay.text = "対戦相手が離脱しました\nしばらくお待ちください"
    });

    this.gameInfo.socket.on('restartGame', (data: any) => {
      // if (this.gameInfo.isServer) {
      //   this.startTime = Date.now() + this.standByTime;
      // }
      // this.alreadyStartedWaitingFrag = false;
      // this.waitingFrag = false;
      // this.ball?.setVelocity(0, 0);
      // console.log('restart Game');
      // this.gameInfo.gameData.score.hostPlayerScore = data.gameData.hostPlayerScore;
      // this.gameInfo.gameData.score.clientPlayerScore = data.gameData.clientPlayerScore;
      // this.stringDisplay.text = `${this.gameInfo.gameData.score.hostPlayerScore} - ${this.gameInfo.gameData.score.clientPlayerScore}`;
      // console.log(data);
      this.startStandBy();
      this.display!.leavedMessageDisplay.text = "";
    });

    if (!this.gameInfo.isServer) {
      this.gameInfo.socket.on('updateEventGameData', (data: any) => {
        // console.log(data);
        if (data.eventType === 'startedStandBy') {
          this.ball?.setVelocity(0, 0);
          this.ball?.setPosition(400, 300);
          this.startTime = data.data.startTime;
          this.gameStatus = 'standBy';
          // console.log(this.startTime);
        } else if (data.eventType === 'getPoint') {
          this.gameInfo.gameData.score.hostPlayerScore = data.data.hostScore;
          this.gameInfo.gameData.score.clientPlayerScore = data.data.clientScore;
          // this.stringDisplay.text = `${this.gameInfo.gameData.score.hostPlayerScore} - ${this.gameInfo.gameData.score.clientPlayerScore}`;
          this.reloadDisplayScore();
        }
      });
    }
  }

  /**
   * 毎フレームのゲームデータの送信
   */
  sendGameData(): void {
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

    // this.sendGameData();
    // console.log("Phaser update");

    if (this.gameStatus === 'standBy') {
      if (this.startTime - Date.now() >= 0) {
        // console.log('standby');
        // this.stringDisplay.text = `Waiting. ${1 + Math.floor((this.startTime - Date.now()) / 1000)}`;
        this.display!.standByCountDownDisplay.text = `ゲーム開始まで${1 + Math.floor((this.startTime - Date.now()) / 1000)}秒`;
      } else {
        if (this.gameInfo.isServer) {
          this.start();
        }
        // this.stringDisplay.text = `${this.gameInfo.gameData.score.hostPlayerScore} - ${this.gameInfo.gameData.score.clientPlayerScore}`;
        this.reloadDisplayScore();
        this.gameStatus = 'playing';
        this.display!.standByCountDownDisplay.text = "";
      }
    } else if (this.gameStatus === 'playing') {
      // this.sendGameData();
      if (this.gameInfo.isServer) {
        this.checkScore();
      }
    }
    this.sendGameData();

    // if (!this.waitingFrag) {
    //   // Waiting
    //   if (this.gameInfo.isServer && !this.alreadyStartedWaitingFrag) {
    //     this.gameInfo.socket.emit('eventGameData', {
    //       eventType: 'startedStandBy',
    //       data: {
    //         'startTime': this.startTime
    //       }
    //     });
    //     this.alreadyStartedWaitingFrag = true;
    //   }
    //   if (this.startTime !== -1 && this.startTime - Date.now() >= 0) {
    //     this.stringDisplay.text = `Waiting. ${1 + Math.floor((this.startTime - Date.now()) / 1000)}`;
    //   } else {
    //     this.waitingFrag = true;
    //     if (this.gameInfo.isServer) {
    //       let ballYSpeed: number = Phaser.Math.Between(-300, 300);
    //       this.ball?.setVelocity(this.ballXSpeed, ballYSpeed);
    //     }
    //     this.stringDisplay.text = `${this.gameInfo.gameData.score.hostPlayerScore} - ${this.gameInfo.gameData.score.clientPlayerScore}`;
    //     // console.log('set velocity');
    //   }
    // } else if (this.startTime !== -1) {
    //   // Playing
    //   // this.stringDisplay.text = `${0} - ${0}`;
    //   this.sendGameData();
    //   if (this.gameInfo.isServer) {
    //     this.checkScore();
    //   }
    // }
  }

  checkScore(): void {
    if (this.ball?.body.position.x !== undefined && this.ball?.body.position.x > 770) {
      this.gameInfo.gameData.score.hostPlayerScore += 1;
      // this.stringDisplay.text = `${this.gameInfo.gameData.score.hostPlayerScore} - ${this.gameInfo.gameData.score.clientPlayerScore}`;
      // this.start();
      this.reloadDisplayScore();
      this.startStandBy();
      this.sendScoreEvent();
    } else if (this.ball?.body.position.x !== undefined && this.ball?.body.position.x < 30) {
      this.gameInfo.gameData.score.clientPlayerScore += 1;
      // this.stringDisplay.text = `${this.gameInfo.gameData.score.hostPlayerScore} - ${this.gameInfo.gameData.score.clientPlayerScore}`;
      // this.start();
      this.reloadDisplayScore();
      this.startStandBy();
      this.sendScoreEvent();
    }
    if (this.gameInfo.gameData.score.hostPlayerScore > 10 || this.gameInfo.gameData.score.clientPlayerScore > 10) {
      this.gameOver();
    }
  }

  start(): void {
    this.ball?.setPosition(400, 300);
    let ballYSpeed: number = Phaser.Math.Between(-300, 300);
    this.ball?.setVelocity(this.ballXSpeed, ballYSpeed);
  }

  sendScoreEvent(): void {
    this.gameInfo.socket.emit('eventGameData', {
      roomId: this?.gameInfo.roomID,
      eventType: 'getPoint',
      data: {
        hostScore: this.gameInfo.gameData.score.hostPlayerScore,
        clientScore: this.gameInfo.gameData.score.clientPlayerScore
      }
    });
  }

  startStandBy(): void {
    // this.start();
    this.ball?.setVelocity(0, 0);
    this.ball?.setPosition(400, 300);
    this.startTime = Date.now() + this.standByTime;
    this.gameStatus = 'standBy';
    // console.log('standBy');
    if (this.gameInfo.isServer) {
      this.gameInfo.socket.emit('eventGameData', {
        roomId: this?.gameInfo.roomID,
        eventType: 'startedStandBy',
        data: {
          startTime: this.startTime
        }
      });
    }
  }

  reloadDisplayScore(): void {
    this.display!.score.hostPlayerScoreDisplay.text = `${this.gameInfo.gameData.score.hostPlayerScore}`;
    this.display!.score.clientPlayerScoreDisplay.text = `${this.gameInfo.gameData.score.clientPlayerScore}`;
  }

  gameOver(): void {
    this.gameInfo.socket.emit('eventGameData', {
      roomId: this?.gameInfo.roomID,
      eventType: 'gameOver',
      data: {
        hostScore: this.gameInfo.gameData.score.hostPlayerScore,
        clientScore: this.gameInfo.gameData.score.clientPlayerScore
      }
    });
    this.gameStatus = 'end';
    if (this.gameInfo.isServer) {
      // axios.post(constUrl.serversideUrl + '/history', {
      //   // leftPlayer: this.gameInfo
      //   leftScore: this.gameInfo.gameData.score.hostPlayerScore,
      //   rightScore: this.gameInfo.gameData.score.clientPlayerScore
      // });
    }
  }
}
