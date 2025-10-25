import { EventBus } from '../EventBus';
import { GameObjects, Scene } from 'phaser';

export class CharSelect extends Scene
{
    background: Phaser.GameObjects.Image;
    gameText: Phaser.GameObjects.Text;
    title: GameObjects.Text;

    selectedId?: string;
    characters: { id: string; container: Phaser.GameObjects.Container }[] = [];

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

        const charData = [
            {id: 'oldman', texture: 'oldman', name: 'Old Man'},
            {id: 'girl', texture: 'girl', name: 'Girl'}
        ]

        const spacing = width / (charData.length + 1)

        charData.forEach((char, i) => {
        const x = spacing * (i + 1);
        const y = height * 0.6;

      
        const image = this.add.image(0, 0, char.texture).setOrigin(0.5);
        const label = this.add.text(0, image.height / 2 + 40, char.name, {
        fontFamily: 'Arial Black',
        fontSize: 28,
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 6,
        }).setOrigin(0.5);

      
        const container = this.add.container(x, y, [image, label]);

        this.characters.push({ id: char.id, container });
        container.setSize(image.width, image.height + label.height);
        container.setInteractive({ useHandCursor: true });

        container.on('pointerdown', () => {
            this.scene.start('Cafe'); 
        });
        });

        


        EventBus.emit('current-scene-ready', this);
    }

}
