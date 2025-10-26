import { Scene } from 'phaser';

export class Preloader extends Scene {
  constructor() {
    super('Preloader');
  }

    init ()
    {
       

    }

    preload ()
    {
        //  load ui assets
        this.load.setPath('/assets/ui')
        
        this.load.image('restaurantBg', 'background.png');

        // load character assets
        this.load.setPath('/assets/characters');

        this.load.spritesheet('player', 'salma.png',{
          frameWidth: 32,
          frameHeight: 32
        });

        this.load.spritesheet('npc', 'anika.png', {
          frameWidth: 32,
          frameHeight: 32
        });

        // load interior assets
        this.load.setPath('/assets/interior');
        this.load.image('table', 'table.png');
        this.load.image('chair', 'chair.png');
        this.load.image('counter', 'counter.png');

    }

  create() {
    if (!this.anims.exists('walk-down')) {
    this.anims.create({
      key: 'walk-down',
      frames: this.anims.generateFrameNumbers('player', { start: 0, end: 2 }),
      frameRate: 5,
      repeat: -1
    });
}

    if (!this.anims.exists('walk-up')) {
    this.anims.create({
      key: 'walk-up',
      frames: this.anims.generateFrameNumbers('player', { start: 3, end: 5 }),
      frameRate: 5,
      repeat: -1
    });
}

    if (!this.anims.exists('walk-right')) {
    this.anims.create({
      key: 'walk-right',
      frames: this.anims.generateFrameNumbers('player', { start: 6, end: 8 }),
      frameRate: 5,
      repeat: -1
    });
}

    if (!this.anims.exists('walk-left')) {
    this.anims.create({
      key: 'walk-left',
      frames: this.anims.generateFrameNumbers('player', { start: 9, end: 11 }),
      frameRate: 5,
      repeat: -1
    });
}


    this.scene.start('MainMenu');
  }
}
