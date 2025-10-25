import { EventBus } from '../EventBus';
import { GameObjects, Scene } from 'phaser';

export class CharSelect extends Scene
{
    background: Phaser.GameObjects.Image;
    gameText: Phaser.GameObjects.Text;
    title: GameObjects.Text;

    constructor ()
    {
        super('CharSelect');
    }

    create ()
    {
    
        const {width, height} = this.scale;
        
        this.title = this.add.text(width/2, height*0.3, 'Choose your character!', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5).setDepth(100);

        EventBus.emit('current-scene-ready', this);
    }

    changeScene ()
    {
        this.scene.start('GameOver');
    }
}
