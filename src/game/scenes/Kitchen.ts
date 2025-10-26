import { EventBus } from '../EventBus';
import { GameObjects, Scene } from 'phaser';

export class Kitchen extends Scene
{
    background: Phaser.GameObjects.Image;
    gameText: Phaser.GameObjects.Text;
    title: GameObjects.Text;


    constructor ()
    {
        super('Kitchen');
    }

    create ()
    {
        
        const {width, height} = this.scale;
        
        this.title = this.add.text(width/2, height*0.3, 'We in the kitchen', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        const player = this.add.sprite(200, 200, 'player');
        player.anims.play('walk-down', true);

        EventBus.emit('current-scene-ready', this);
    }

    changeScene ()
    {
        this.scene.start('Cafe');
    }
}