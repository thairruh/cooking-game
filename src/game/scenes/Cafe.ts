import { EventBus } from '../EventBus';
import { GameObjects, Scene } from 'phaser';
import { GridEngine, GridEngineHeadless } from "grid-engine";

export class Cafe extends Scene
{
    background: Phaser.GameObjects.Image;
    gameText: Phaser.GameObjects.Text;
    title: GameObjects.Text;


    constructor ()
    {
        super('Cafe');
    }

    create ()
    {
        
        const {width, height} = this.scale;

        this.background = this.add.image(width / 2, height / 2, 'restaurantBg')
        .setOrigin(0.5).setDepth(0);

        const bgWidth = this.background.width;
        const bgHeight = this.background.height;

        const scaleX = width / bgWidth;
        const scaleY = height / bgHeight;
        const scale = Math.max(scaleX, scaleY);

        this.background.setScale(scale);

        const player = this.add.sprite(150, 165, 'player');
        player.anims.play('walk-down', true);


        this.createTableSet(80, 135);
        this.createTableSet(80, 220);

        EventBus.emit('current-scene-ready', this);
    }

    createTableSet(x: number, y: number) {
            // table
            const table = this.add.sprite(x, y, 'table')
            .setOrigin(0.5).setDepth(1);
            table.setScale(0.75);

            // chairs
            const chair1 = this.add.sprite(x - 20, y - 2, 'chair')
            .setOrigin(0.5).setDepth(1);
            chair1.setScale(0.75);

            const chair2 = this.add.sprite(x + 20, y - 2, 'chair')
            .setOrigin(0.5).setDepth(1);
            chair2.setScale(0.75);
            chair2.flipX = true;

            return this.add.container(0, 0, [table, chair1, chair2]);
        }

    changeScene ()
    {
        this.scene.start('GameOver');
    }
}
