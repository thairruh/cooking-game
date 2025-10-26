import { Scene } from 'phaser';


export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        //  We loaded this image in our Boot Scene, so we can display it here
        this.add.image(512, 384, 'background');

    }

    preload ()
    {
        //  Load the assets for the game - Replace with your own assets
        this.load.setPath('/assets/characters')
        this.load.image('oldman', 'oldman.png');
        this.load.image('girl', 'girl.png');

        this.load.spritesheet('anika', 'anika.png', {
        frameWidth: 32,
        frameHeight: 32
        });

    }

    create ()
    {
        this.anims.create({
            key: 'walk-down',
            frames: this.anims.generateFrameNumbers('anika', {start: 0, end: 2}),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'walk-up',
            frames: this.anims.generateFrameNumbers('player', {start: 3, end: 5}),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'walk-left',
            frames: this.anims.generateFrameNumbers('player', {start: 6, end: 8}),
            frameRate: 5,
            repeat: -1
        });

        this.anims.create({
            key: 'walk-right',
            frames: this.anims.generateFrameNumbers('player', {start: 9, end: 11}),
            frameRate: 5,
            repeat: -1
        });

        const player = this.add.sprite(200,200, 'anika');

        player.anims.play('walk-down', true);


        this.scene.start('MainMenu');
    }
}
