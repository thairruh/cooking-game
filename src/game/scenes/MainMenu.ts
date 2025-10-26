import { GameObjects, Scene } from 'phaser';

import { EventBus } from '../EventBus';

export class MainMenu extends Scene
{
    background: GameObjects.Image;
    logo: GameObjects.Image;
    title: GameObjects.Text;
    logoTween: Phaser.Tweens.Tween | null;

    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        const {width, height} = this.scale;
        
        this.title = this.add.text(width/2, height*0.5, 'Start', {
            fontFamily: 'bongo', fontSize: 20, color: '#ffffff',
            align: 'center'
        }).setOrigin(0.5).setDepth(100).setInteractive({useHandCursor: true});

       
        this.title.on('pointerover', () => {
            this.title.setStyle({ color: '#ffd966' }); 
        });

        this.title.on('pointerout', () => {
            this.title.setStyle({ color: '#ffffff' }); 
        });

        this.title.on('pointerdown', () => {
            this.scene.start('Cafe'); 
        });

        EventBus.emit('current-scene-ready', this);
    }
    

}
