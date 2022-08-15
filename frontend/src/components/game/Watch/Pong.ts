import Phaser from 'phaser';
import { gameInfo } from './Watch';

type GameStatus = 'waiting' | 'standBy' | 'playing' | 'leaved' | 'end'

type StringDisplay = {
  leavedMessageDisplay: any;
  standByCountDownDisplay: any;
}

type scoreBoard = {
  hostPlayer: {
    firstPlace: any;
    secondPlace: any;
  };
  clientPlayer: {
    firstPlace: any;
    secondPlace: any;
  }
}

let DISPLAY_WIDTH = 900;
let DISPLAY_HEIGHT = 800;


export default class PongClassic extends Phaser.Scene {
  private playerGroup?: Phaser.Physics.Arcade.Group;
  private player1?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private player2?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private ball?: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
  private ballXSpeed: number = 400;
  private gameInfo: any;
  private startTime: number = -1;
  private gameStatus: GameStatus = 'standBy';
  private display?: StringDisplay;
  private scoreBoard?: scoreBoard;

  private readonly standByTime: number = 1500;

  constructor() {
    super({
      key: 'Main'
    })

    this.gameInfo = gameInfo;

    if (this.gameInfo.gameData.latestPaddlePosition.host === -1) {
      this.gameInfo.gameData.latestPaddlePosition.host = DISPLAY_HEIGHT / 2;
      this.gameInfo.gameData.latestPaddlePosition.client = DISPLAY_HEIGHT / 2;
    }
  }

  // init(): void { }

  preload(): void {
    this.load.image('player', `${window.location.origin}/assets/player.png`);
    this.load.image('ball', `${window.location.origin}/assets/ball.png`);
    this.load.image('rectangle', `${window.location.origin}/assets/1px.png`);
    for (let i = 0; i < 10; i++) {
      this.load.image(`${i}`, `${window.location.origin}/assets/pongScoreFont/${i}.png`);
    }
  }

  /**
   * Phaser初期実行時の関数
   * オブジェクトの生成、ソケットの初期化等を行う
   */
  create(): void {
    this.playerGroup = this.physics.add.group();

    this.player1 = this.playerGroup.create(
      this.gameInfo.isServer ? 50 : DISPLAY_WIDTH - 50,
      // DISPLAY_HEIGHT / 2,
      this.gameInfo.isServer ? this.gameInfo.gameData.latestPaddlePosition.host : this.gameInfo.gameData.latestPaddlePosition.client,
      "rectangle"
    ).setScale(10, 75).refreshBody().setOrigin(0.5);
    this.player1?.setCollideWorldBounds(true);
    this.player1?.setImmovable(true);

    this.player2 = this.playerGroup.create(
      this.gameInfo.isServer ? DISPLAY_WIDTH - 50 : 50,
      // DISPLAY_HEIGHT / 2,
      this.gameInfo.isServer ? this.gameInfo.gameData.latestPaddlePosition.client : this.gameInfo.gameData.latestPaddlePosition.host,
      "rectangle"
    ).setScale(10, 75).refreshBody().setOrigin(0.5);
    this.player2?.setCollideWorldBounds(true);
    this.player2?.setImmovable(true);

    this.ball = this.physics.add.sprite(DISPLAY_WIDTH / 2, DISPLAY_HEIGHT / 2, "rectangle").setScale(10, 10).refreshBody().setOrigin(0.5);
    this.ball.setVelocity(0, 0);
    this.ball.setCollideWorldBounds(true);
    this.ball.setBounce(1);

    this.physics.add.collider(this.ball, this.playerGroup, (b, p) => {
      let sign = -1;
      if (p.body.position.x < DISPLAY_WIDTH/2) {
        sign = 1;
      }
      let paddlePositionY = p.body.position.y + (75/2);
      let ballPositionY = b.body.position.y + (10/2);
      let relativeIntersectY = paddlePositionY - ballPositionY;
      let normalizedRelativeIntersectionY = (relativeIntersectY / (75/2+10/2));
      let bounceAngle = normalizedRelativeIntersectionY * ((5 * Math.PI) / 12);
      b.body.velocity.x = 500 * Math.cos(bounceAngle) * sign;
      b.body.velocity.y = 500 * -Math.sin(bounceAngle);
    }, undefined, this);

    this.setSocketEvent();

    this.display = {
      leavedMessageDisplay: this.add.text(DISPLAY_WIDTH/2, 250, "").setFontSize(30).setOrigin(0.5),
      standByCountDownDisplay: this.add.text(DISPLAY_WIDTH/2, 100, "").setFontSize(30).setOrigin(0.5),
    }
    // console.log('update score');

    this.startStandBy();

    this.scoreBoard = {
      hostPlayer: {
        firstPlace: this.add.sprite(180, 50, '0').setScale(15, 15).setOrigin(0),
        secondPlace: this.add.sprite(60, 50, '0').setScale(15, 15).setOrigin(0)
      },
      clientPlayer: {
        firstPlace: this.add.sprite(DISPLAY_WIDTH - 60, 50, '0').setScale(15, 15).setOrigin(1, 0),
        secondPlace: this.add.sprite(DISPLAY_WIDTH - 180, 50, '0').setScale(15, 15).setOrigin(1, 0)
      },
    };
    this.reloadDisplayScore();

    for (let i = 0; i < 21; i++) {
      this.add.line(0, i * 40, DISPLAY_WIDTH / 2, 0, DISPLAY_WIDTH / 2, 25, 0xFFFFFF).setLineWidth(2, 2).setOrigin(0.5);
    }
  }

  setSocketEvent(): void {
    this.gameInfo.socket.on('hello', (data: any) => {
      // console.log(data);
    })

    this.gameInfo.socket.on('UpdateCheckedGameData', (data: any) => {
      // console.log(data);
      // if (!this.gameInfo.isServer) {
      //   this.ball?.setVelocity(data.ball.velocity.x, data.ball.velocity.y);
      //   this.ball?.setPosition(data.ball.position.x, data.ball.position.y);
      // }
      // this.player2?.setVelocityY(data.player.velocity.y);
      // this.player2?.setPosition(this.gameInfo.isServer ? DISPLAY_WIDTH - 50 : 50, data.player.position.y);
      // console.log();
      if (data.hasOwnProperty('ball')) {
        this.ball?.setVelocity(data.ball.velocity.x, data.ball.velocity.y);
        this.ball?.setPosition(data.ball.position.x, data.ball.position.y);
        this.player2?.setVelocityY(data.player.velocity.y);
        this.player2?.setPosition(50, data.player.position.y);
      } else {
        this.player1?.setVelocityY(data.player.velocity.y);
        this.player1?.setPosition(DISPLAY_WIDTH - 50, data.player.position.y);
      }
    });

    this.gameInfo.socket.on('PlayerLeaveRoom', (data: any) => {
      this.ball?.setVelocity(0, 0);
      this.ball?.setPosition(DISPLAY_WIDTH / 2, DISPLAY_HEIGHT / 2);
      this.gameStatus = 'leaved';
      this.display!.standByCountDownDisplay.text = '';
      this.display!.leavedMessageDisplay.text = "プレイヤーが離脱しました\nしばらくお待ちください"
      this.player1?.setVelocity(0, 0);
      this.player2?.setVelocity(0, 0);
    });

    this.gameInfo.socket.on('restartGame', (data: any) => {
      this.startStandBy();
      this.display!.leavedMessageDisplay.text = "";
    });

    if (!this.gameInfo.isServer) {
      this.gameInfo.socket.on('updateEventGameData', (data: any) => {
        if (data.eventType === 'startedStandBy') {
          this.ball?.setVelocity(0, 0);
          this.ball?.setPosition(DISPLAY_WIDTH / 2, DISPLAY_HEIGHT / 2);
          this.startTime = data.data.startTime;
          this.gameStatus = 'standBy';
        } else if (data.eventType === 'getPoint') {
          this.gameInfo.gameData = data.data;
          this.ball!.visible = false;
          this.reloadDisplayScore();
        }
      });
    }
  }

  update(): void {

    if (this.gameStatus === 'standBy') {
      if (this.startTime - Date.now() >= 0) {
        this.display!.standByCountDownDisplay.text = `ゲーム開始まで${1 + Math.floor((this.startTime - Date.now()) / 1000)}秒`;
      } else {
        this.ball!.visible = true;
        if (this.gameInfo.isServer) {
          this.start();
        }
        this.reloadDisplayScore();
        this.gameStatus = 'playing';
        this.display!.standByCountDownDisplay.text = "";
      }
    } else if (this.gameStatus === 'playing') {
      if (this.gameInfo.isServer) {
        this.checkScore();
      }
    }
  }

  updateLatestPaddlePosition() {
    let hostPosition, clientPosition;

    if (this.gameInfo.isServer) {
      hostPosition = this.player1?.body.position.y;
      clientPosition = this.player2?.body.position.y;
    } else {
      hostPosition = this.player2?.body.position.y;
      clientPosition = this.player1?.body.position.y;
    }
    this.gameInfo.gameData.latestPaddlePosition = {
      host: hostPosition,
      client: clientPosition
    }
  }

  checkScore(): void {
    if (this.ball?.body.position.x !== undefined && this.ball?.body.position.x > DISPLAY_WIDTH - 30) {
      this.gameInfo.gameData.score.hostPlayerScore += 1;
      this.gameInfo.gameData.nextServe = 'client';
      this.updateLatestPaddlePosition();
      this.reloadDisplayScore();
      this.startStandBy();
      this.updateDisplayScore('host', this.gameInfo.gameData.score.hostPlayerScore);
    } else if (this.ball?.body.position.x !== undefined && this.ball?.body.position.x < 30) {
      this.gameInfo.gameData.score.clientPlayerScore += 1;
      this.gameInfo.gameData.nextServe = 'host';
      this.updateLatestPaddlePosition();
      this.reloadDisplayScore();
      this.startStandBy();
      this.updateDisplayScore('client', this.gameInfo.gameData.score.clientPlayerScore);
    }
    if (this.gameInfo.gameData.score.hostPlayerScore > 10 || this.gameInfo.gameData.score.clientPlayerScore > 10) {
      this.gameOver();
    }
  }

  start(): void {
    let ballPositionY = Phaser.Math.Between(150, DISPLAY_HEIGHT - 150);
    this.ball?.setPosition(DISPLAY_WIDTH / 2, ballPositionY);
    let ballYSpeed: number = Phaser.Math.Between(-300, 300);
    let serve = this.gameInfo.gameData.nextServe === 'client' ? 1 : -1;
    this.ball?.setVelocity(this.ballXSpeed * serve, ballYSpeed);
  }

  startStandBy(): void {
    this.ball?.setVelocity(0, 0);
    this.ball?.setPosition(DISPLAY_WIDTH / 2, DISPLAY_HEIGHT / 2);
    this.ball!.visible = false;
    this.startTime = Date.now() + this.standByTime;
    this.gameStatus = 'standBy';
  }

  updateDisplayScore(player: 'host' | 'client', score: number): void {
    if (score < 0) {
      score = 0;
    } else if (score > 99) {
      score = 99;
    }
    if (player === 'host') {
      let first = score % 10;
      let second = Math.floor(score / 10);
      this.scoreBoard?.hostPlayer.firstPlace.setTexture(`${first}`);
      if (second !== 0) {
        this.scoreBoard!.hostPlayer.secondPlace.visible = true;
        this.scoreBoard?.hostPlayer.secondPlace.setTexture(`${second}`);
      } else {
        this.scoreBoard!.hostPlayer.secondPlace.visible = false;
      }
    } else if (player === 'client') {
      let first = score % 10;
      let second = Math.floor(score / 10);
      this.scoreBoard?.clientPlayer.firstPlace.setTexture(`${first}`);
      if (second !== 0) {
        this.scoreBoard!.clientPlayer.secondPlace.visible = true;
        this.scoreBoard?.clientPlayer.secondPlace.setTexture(`${second}`);
      } else {
        this.scoreBoard!.clientPlayer.secondPlace.visible = false;
      }
    }
  }

  reloadDisplayScore(): void {
    this.updateDisplayScore('host', this.gameInfo.gameData.score.hostPlayerScore);
    this.updateDisplayScore('client', this.gameInfo.gameData.score.clientPlayerScore);
  }

  gameOver(): void {
    this.gameStatus = 'end';
  }
}
