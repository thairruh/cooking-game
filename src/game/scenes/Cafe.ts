import { EventBus } from '../EventBus';
import { GameObjects, Scene } from 'phaser';


export class Cafe extends Scene
{
    background: Phaser.GameObjects.Image;
    gameText: Phaser.GameObjects.Text;
    title: GameObjects.Text;

    player!: Phaser.Physics.Arcade.Sprite;
    cursors!: any;


    constructor ()
    {
        super('Cafe');
    }

    create ()
    { 
        console.log('has player texture?', this.textures.exists('player'));
        console.log('has walk-down anim?', this.anims.exists('walk-down'));
        console.log('has walk-up anim?', this.anims.exists('walk-up'));
        console.log('has walk-side anim?', this.anims.exists('walk-side'));


        // Enable physics 
        this.player = this.physics.add.sprite(150, 165, 'player');
        this.player.setCollideWorldBounds(true); // stops at screen edges

        // Store movement keys
        this.cursors = this.input.keyboard!.addKeys({
        w: Phaser.Input.Keyboard.KeyCodes.W,
        a: Phaser.Input.Keyboard.KeyCodes.A,
        s: Phaser.Input.Keyboard.KeyCodes.S,
        d: Phaser.Input.Keyboard.KeyCodes.D
        });

        const {width, height} = this.scale;

        this.background = this.add.image(width / 2, height / 2, 'restaurantBg')
        .setOrigin(0.5).setDepth(0);

        const bgWidth = this.background.width;
        const bgHeight = this.background.height;

        const scaleX = width / bgWidth;
        const scaleY = height / bgHeight;
        const scale = Math.max(scaleX, scaleY);

        this.background.setScale(scale);

        
        this.player.setScale(2);
        this.player.setDepth(2);

        const counter = this.physics.add.staticSprite(400, 205, 'counter')
        .setOrigin(0.5).setDepth(1.25);
        counter.setScale(1.5);

        this.createTableSet(110, 155);
        this.createTableSet(110, 260);

        this.physics.add.collider(this.player, counter);


        EventBus.emit('current-scene-ready', this);
    }

    createTableSet(x: number, y: number) {
            // table
            const table = this.add.sprite(x, y, 'table')
            .setOrigin(0.5).setDepth(1);
            table.setScale(1.5);

            // chairs
            const chair1 = this.add.sprite(x - 40, y - 2, 'chair')
            .setOrigin(0.5).setDepth(1);
            chair1.setScale(1.5);

            const chair2 = this.add.sprite(x + 40, y - 2, 'chair')
            .setOrigin(0.5).setDepth(1);
            chair2.setScale(1.5);
            chair2.flipX = true;

            return this.add.container(0, 0, [table, chair1, chair2]);
        }

    update() {
        const speed = 100;

        // Stop previous movement
        this.player.setVelocity(0);

        // Move and play animations
        if (this.cursors.a.isDown) {
            this.player.setVelocityX(-speed);
            this.player.flipX = false; // face left
            this.player.anims.play('walk-left', true);
        } 
        else if (this.cursors.d.isDown) {
            this.player.setVelocityX(speed);
            this.player.flipX = false; // face right
            this.player.anims.play('walk-right', true);
        } 
        else if (this.cursors.w.isDown) {
            this.player.setVelocityY(-speed);
            this.player.anims.play('walk-up', true);
        } 
        else if (this.cursors.s.isDown) {
            this.player.setVelocityY(speed);
            this.player.flipX = false;
            this.player.anims.play('walk-down', true);
        } 
        else {
            // stop animations when idle
            this.player.anims.stop();
        }
    }


    changeScene ()
    {
        this.scene.start('GameOver');
    }
}
