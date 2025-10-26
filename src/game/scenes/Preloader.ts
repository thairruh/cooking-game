import { Scene } from 'phaser';

export class Preloader extends Scene {
  constructor() {
    super('Preloader');
  }

  init() {
    // Remove reliance on a 'background' key you don't load here.
    // If you want a splash image, load it in preload() first.
  }

  preload() {
    this.load.setPath('/assets/characters');
    this.load.image('oldman', 'oldman.png');
    this.load.image('girl', 'girl.png');

    this.load.spritesheet('anika', 'anika.png', {
      frameWidth: 32,
      frameHeight: 32
    });
  }

  create() {
    this.anims.create({
      key: 'walk-down',
      frames: this.anims.generateFrameNumbers('anika', { start: 0, end: 2 }),
      frameRate: 5,
      repeat: -1
    });

    this.anims.create({
      key: 'walk-up',
      frames: this.anims.generateFrameNumbers('anika', { start: 3, end: 5 }),
      frameRate: 5,
      repeat: -1
    });

    this.anims.create({
      key: 'walk-left',
      frames: this.anims.generateFrameNumbers('anika', { start: 6, end: 8 }),
      frameRate: 5,
      repeat: -1
    });

    this.anims.create({
      key: 'walk-right',
      frames: this.anims.generateFrameNumbers('anika', { start: 9, end: 11 }),
      frameRate: 5,
      repeat: -1
    });

    // Optional test sprite:
    // const player = this.add.sprite(200, 200, 'anika').play('walk-down');

    this.scene.start('MainMenu');
  }
}
